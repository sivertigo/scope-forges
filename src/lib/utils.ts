import { RelationInfo, TableData, ColumnData } from "@/data/definition";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * mermaidのテキストをテーブルとリレーションの情報に変換する
 * @param mermaidText mermaidのテキスト
 * @returns テーブルとリレーションの情報
 */
export const parseMermaidToTables = (mermaidText: string): TableData[] => {
  const tables: TableData[] = [];
  const relations: RelationInfo[] = [];
  const lines = mermaidText.split("\n");
  let currentTable: TableData | null = null;

  // テーブルとリレーションの情報を収集
  for (const line of lines) {
    const trimmedLine = line.trim();

    // テーブル定義の開始
    if (trimmedLine.match(/^\w+\s*\{$/)) {
      const tableName = trimmedLine.split("{")[0].trim();
      // id は連番をふる
      currentTable = {
        id: (tables.length + 1).toString(),
        name: tableName,
        columns: [],
      };
      continue;
    }

    // テーブル定義の終了
    if (trimmedLine === "}") {
      if (currentTable) {
        tables.push(currentTable);
        currentTable = null;
      }
      continue;
    }

    // カラム定義
    if (currentTable && trimmedLine) {
      //
      const columnMatch = trimmedLine.match(
        /^\s*(\w+)\s+(\w+)(?:\s+(PK|FK|PK\s+FK|FK\s+PK))?(?:\s+"([^"]+)")?$/
      );
      if (columnMatch) {
        const [, type, name, keyType, comment] = columnMatch;
        const column: ColumnData = {
          id: (currentTable.columns.length + 1).toString(),
          name,
          type,
          comment: comment || "",
          isPrimaryKey: keyType?.includes("PK") || false,
          isForeignKey: keyType?.includes("FK") || false,
        };
        currentTable.columns.push(column);
      }
    }

    // リレーション定義
    const relationMatch = trimmedLine.match(
      /^(\w+)\s+(\|\|--o\{|\|\|--\||o\|\|--\||o\|\|--o\{)\s+(\w+)\s*:\s*"([^"]+)"$/
    );
    if (relationMatch) {
      const [, sourceTable, relationType, targetTable, columnName] =
        relationMatch;
      relations.push({
        sourceTable,
        targetTable,
        sourceColumn: "id",
        targetColumn: columnName,
        relationType,
      });
      // 例：users ||--o{ Table3 column1
      // この場合、
      // sourceTable: users
      // targetTable: Table3
      // sourceColumn: column1
      // targetColumn: column1
      // relationType: --o
      // targetTableとColumn側に定義をつける
    }
  }

  // リレーションをテーブルに反映
  relations.forEach((relation) => {
    const sourceTable = tables.find((t) => t.name === relation.sourceTable);
    const targetTable = tables.find((t) => t.name === relation.targetTable);

    if (sourceTable && targetTable) {
      // targetColumnにforeignKeyReferenceを追加
      const targetColumn = targetTable.columns.find(
        (c) => c.name === relation.targetColumn
      );
      if (targetColumn) {
        targetColumn.foreignKeyReference = {
          tableId: sourceTable.id,
          columnId: sourceTable.columns.find((c) => c.name === "id")?.id || "",
        };
      }
    }
  });

  return tables;
};

/**
 * テーブルとリレーションの情報をmermaidのテキストに変換する
 * @param tables テーブルとリレーションの情報
 * @returns mermaidのテキスト
 */
export const convertERDToMermaid = (tables: TableData[]) => {
  let mermaidCode = "erDiagram\n";

  // テーブル定義
  tables.forEach((table) => {
    mermaidCode += `    ${table.name} {\n`;
    table.columns.forEach((column) => {
      let columnDef = `        ${column.type} ${column.name}`;
      if (column.isPrimaryKey) columnDef += " PK";
      if (column.isForeignKey) {
        columnDef += ` FK`;
      }
      if (column.comment) {
        columnDef += ` "${column.comment}"`;
      }
      mermaidCode += columnDef + "\n";
    });
    mermaidCode += "    }\n";
  });

  // リレーションシップ定義
  tables.forEach((table) => {
    table.columns.forEach((column) => {
      if (column.isForeignKey && column.foreignKeyReference) {
        const refTable = tables.find(
          (t) => t.id === column.foreignKeyReference?.tableId
        );
        if (refTable) {
          mermaidCode += `    ${refTable.name} ||--o{ ${table.name} : "${column.name}"\n`;
        }
      }
    });
  });

  return mermaidCode;
};

/**
 * テーブルとリレーションの情報をPostgreSQLのDDLに変換する
 * @param tables テーブルとリレーションの情報
 * @returns PostgreSQLのDDL
 */
export const generatePostgreSQLDDL = (tables: TableData[]): string => {
  let ddl = "";

  // データ型のマッピング
  const typeMapping: { [key: string]: string } = {
    varchar: "VARCHAR(255)",
    int: "INTEGER",
    bigint: "BIGINT",
    text: "TEXT",
    boolean: "BOOLEAN",
    date: "DATE",
    datetime: "TIMESTAMP",
    timestamp: "TIMESTAMP",
  };

  // テーブル定義の生成
  tables.forEach((table) => {
    // テーブルコメントの追加
    ddl += `-- ${table.name}テーブルの定義\n`;
    ddl += `CREATE TABLE "${table.name}" (\n`;

    // カラム定義の生成
    const columnDefinitions = table.columns.map((column) => {
      const pgType =
        typeMapping[column.type.toLowerCase()] || column.type.toUpperCase();
      let columnDef = `    "${column.name}" ${pgType}`;

      // NOT NULL制約
      if (column.isPrimaryKey) {
        columnDef += " NOT NULL";
      }

      // コメントの追加
      if (column.comment) {
        columnDef += ` -- ${column.comment}`;
      }

      return columnDef;
    });

    // 主キー制約の生成
    const primaryKeys = table.columns
      .filter((col) => col.isPrimaryKey)
      .map((col) => `"${col.name}"`);

    if (primaryKeys.length > 0) {
      columnDefinitions.push(`    PRIMARY KEY (${primaryKeys.join(", ")})`);
    }

    ddl += columnDefinitions.join(",\n");
    ddl += "\n);\n\n";

    // テーブルコメントの追加
    if (table.comment) {
      ddl += `COMMENT ON TABLE "${table.name}" IS '${table.comment}';\n\n`;
    }

    // カラムコメントの追加
    table.columns.forEach((column) => {
      if (column.comment) {
        ddl += `COMMENT ON COLUMN "${table.name}"."${column.name}" IS '${column.comment}';\n`;
      }
    });
    ddl += "\n";

    // 外部キー制約の生成
    table.columns.forEach((column) => {
      if (column.isForeignKey && column.foreignKeyReference) {
        const refTable = tables.find(
          (t) => t.id === column.foreignKeyReference?.tableId
        );
        const refColumn = refTable?.columns.find(
          (c) => c.id === column.foreignKeyReference?.columnId
        );

        if (refTable && refColumn) {
          const constraintName = `fk_${table.name}_${column.name}`;
          ddl += `ALTER TABLE "${table.name}"\n`;
          ddl += `    ADD CONSTRAINT "${constraintName}"\n`;
          ddl += `    FOREIGN KEY ("${column.name}")\n`;
          ddl += `    REFERENCES "${refTable.name}" ("${refColumn.name}");\n\n`;

          // 外部キーカラムにインデックスを追加
          ddl += `CREATE INDEX "idx_${constraintName}" ON "${table.name}" ("${column.name}");\n\n`;
        }
      }
    });
  });

  return ddl;
};

import { RelationInfo, TableData, ColumnData } from "@/data/definition";
import { type ClassValue, clsx } from "clsx";
import { table } from "console";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
      const columnMatch = trimmedLine.match(
        /^\s*(\w+)\s+(\w+)(?:\s+(PK|FK|PK\s+FK|FK\s+PK))?$/
      );
      if (columnMatch) {
        const [, type, name] = columnMatch;
        const column: ColumnData = {
          id: (currentTable.columns.length + 1).toString(),
          name,
          type,
          comment: "",
          isPrimaryKey: false,
          isForeignKey: trimmedLine.includes("FK"),
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
        sourceColumn: columnName,
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
          columnId:
            sourceTable.columns.find((c) => c.name === relation.sourceColumn)
              ?.id || "",
        };
      }
    }
  });

  return tables;
};

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

interface TableData {
  id: string;
  name: string;
  columns: ColumnData[];
}

interface ColumnData {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyReference?: {
    tableId: string;
    columnId: string;
  };
}
interface RelationInfo {
  sourceTable: string;
  targetTable: string;
  sourceColumn: string;
  targetColumn: string;
  relationType: string;
}

export type { TableData, ColumnData, RelationInfo };

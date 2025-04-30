interface TableData {
  id: string;
  name: string;
  columns: ColumnData[];
  comment?: string;
}

interface ColumnData {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  comment: string;
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

interface ScreenElement {
  id: string;
  type: string;
  name: string;
  properties: {
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    [key: string]: string | boolean | string[] | undefined;
  };
}

interface Screen {
  id: string;
  name: string;
  description: string;
  elements: ScreenElement[];
  requireAuth: boolean;
}

export type { TableData, ColumnData, RelationInfo, Screen, ScreenElement };

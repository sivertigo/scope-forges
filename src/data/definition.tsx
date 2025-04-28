class TableData {
  id: string;
  name: string;
  columns: ColumnData[];
}

class ColumnData {
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

export { TableData, ColumnData };

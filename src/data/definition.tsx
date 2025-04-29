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
interface UIElement {
  id: string;
  type: string;
  label: string;
  value: string;
  description: string;
  required: boolean;
}
interface PreviewAreaProps {
  sections: {
    title: string;
    elements: UIElement[];
  }[];
  title: string;
}

export type {
  TableData,
  ColumnData,
  RelationInfo,
  UIElement,
  PreviewAreaProps,
};

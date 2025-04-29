// ERD全体のプレビュー。マークダウンに変換してからプレビューする。
// マークダウンに変換するときは、テーブル名とカラム名をリンクにする。

import { TableData } from "@/data/definition";

type TablePreviewProps = {
  table: TableData;
};

export default function TablePreview({ table }: TablePreviewProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">{table.name}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 p-2 text-left text-white">
                Column
              </th>
              <th className="border border-gray-600 p-2 text-left text-white">
                Type
              </th>
              <th className="border border-gray-600 p-2 text-left text-white">
                Constraints
              </th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={column.id} className="hover:bg-gray-700">
                <td className="border border-gray-600 p-2 text-white">
                  {column.name}
                </td>
                <td className="border border-gray-600 p-2 text-gray-300">
                  {column.type}
                </td>
                <td className="border border-gray-600 p-2">
                  <div className="flex gap-2">
                    {column.isPrimaryKey && (
                      <span className="px-2 py-1 bg-blue-600 text-white rounded text-sm">
                        PK
                      </span>
                    )}
                    {column.isForeignKey && (
                      <span className="px-2 py-1 bg-purple-600 text-white rounded text-sm">
                        FK
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

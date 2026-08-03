import { Card } from "@/components/ui/card";

export function SimpleTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-stone-200 px-6 py-5 dark:border-white/10">
        <h3 className="font-heading text-2xl">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-white/5">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`} className="border-t border-stone-100 dark:border-white/5">
                {row.map((cell) => (
                  <td key={cell} className="px-6 py-4 text-stone-600 dark:text-stone-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

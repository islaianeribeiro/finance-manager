import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface GraficoItem {
  name: string;
  value: number;
}

interface Props {
  data: GraficoItem[];
}

function stringToColor(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  const s = 60 + (hash % 20);
  const l = 45 + (hash % 10);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function PieChartCard({ data }: Props) {
  return (
    <div className="chart">
      <p>Gastos por Categoria</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name">
            {data.map((entry) => (
              <Cell key={entry.name} fill={stringToColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GraficoItem {
  name: string;
  value: number;
}

interface Props {
  data: GraficoItem[];
}

export function BarChartCard({ data }: Props) {
  return (
    <div className="chart">
      <p>Entradas vs Saídas</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.name === "Entradas" ? "#24246f" : "#e00e29"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

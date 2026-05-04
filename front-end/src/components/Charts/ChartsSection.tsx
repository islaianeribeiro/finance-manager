import { PieChartCard } from "./PieChartCard";
import { BarChartCard } from "./BarChartCard";

interface GraficoItem {
  name: string;
  value: number;
}

interface Props {
  gastosPorCategoria: GraficoItem[];
  resumoData: GraficoItem[];
}

export function ChartsSection({ gastosPorCategoria, resumoData }: Props) {
  return (
    <div className="graphics">
      <h3>Gráficos</h3>
      <PieChartCard data={gastosPorCategoria} />
      <BarChartCard data={resumoData} />
    </div>
  );
}

import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

export function SummaryCard({ title, value, icon }: SummaryCardProps) {
  return (
    <div className="small-card">
      <div className="flex-title">
        {icon}
        <h3>{title}</h3>
      </div>
      <p>R$ {value.toFixed(2)}</p>
    </div>
  );
}

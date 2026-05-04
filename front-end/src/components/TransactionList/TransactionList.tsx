import type { StatusPagamento } from "../../types/finance";
import { type Transacao } from "../../hooks/useFinance";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionItem } from "./TransactionItem";
import { Button } from "../Button";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  transacoesFiltradas: Transacao[];
  filtros: {
    entrada: boolean;
    pago: boolean;
    pendente: boolean;
  };
  setFiltros: React.Dispatch<React.SetStateAction<any>>;
  selecionarTudo: () => void;
  remover: (id: number) => void;
  toggleStatus: (id: number) => void;
  getStatusClass: (status: StatusPagamento) => string;
}

export function TransactionList({
  transacoesFiltradas,
  filtros,
  setFiltros,
  selecionarTudo,
  remover,
  toggleStatus,
  getStatusClass,
}: Props) {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  return (
    <div className="list">
      <div className="list-flex">
        <h2>Histórico de Transações</h2>

        <Button
          className="btn-icon"
          onClick={() => setMostrarFiltro((prev) => !prev)}
          icon={<SlidersHorizontal />}
        />
      </div>

      <div className={`filter-wrapper ${mostrarFiltro ? "open" : ""}`}>
        <TransactionFilters
          filtros={filtros}
          setFiltros={setFiltros}
          selecionarTudo={selecionarTudo}
        />
      </div>

      {transacoesFiltradas.map((t) => (
        <TransactionItem
          key={t.id}
          t={t}
          remover={remover}
          toggleStatus={toggleStatus}
          getStatusClass={getStatusClass}
        />
      ))}
    </div>
  );
}

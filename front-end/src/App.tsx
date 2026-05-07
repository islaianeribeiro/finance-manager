import "./App.css";
import { useState, type ChangeEvent } from "react";
import { Input } from "./components/Input";
import { SummaryCard } from "./components/SummaryCard";
import { ChartsSection } from "./components/Charts/ChartsSection";
import { TransactionForm } from "./components/TransactionForm";
import { useFinance } from "./hooks/useFinance";
import { TransactionList } from "./components/TransactionList/TransactionList";
import { Button } from "./components/Button";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
} from "lucide-react";

export default function App() {
  const {
    form,
    setForm,
    mesFiltro,
    setMesFiltro,
    adicionar,
    erro,
    remover,
    transacoesFiltradas,
    totalEntradas,
    totalSaidas,
    saldo,
    filtros,
    setFiltros,
    selecionarTudo,
    toggleStatus,
    gastosPorCategoria,
    resumoData,
    getStatusClass,
  } = useFinance();

  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSubmit = async () => {
    const sucesso = await adicionar();

    if (sucesso) {
      setMostrarForm(false);
    }
  };
  return (
    <div className="container">
      <h1 className="title">Minhas Finanças</h1>

      <div className="date-card">
        <h2>Escolher data:</h2>
        <Input
          type="month"
          value={mesFiltro}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMesFiltro(e.target.value)
          }
          className="input-data"
        />
      </div>

      <div className="summary-card">
        <SummaryCard
          title="Entradas"
          value={totalEntradas}
          icon={<BanknoteArrowUp />}
        />
        <SummaryCard
          title="Saídas"
          value={totalSaidas}
          icon={<BanknoteArrowDown />}
        />
        <SummaryCard title="Saldo" value={saldo} icon={<CircleDollarSign />} />
      </div>

      <ChartsSection
        gastosPorCategoria={gastosPorCategoria}
        resumoData={resumoData}
      />

      <Button
        className="btn-new"
        onClick={() => setMostrarForm((prev) => !prev)}
      >
        Adicionar Nova Transação
      </Button>

      <div className={`form-wrapper ${mostrarForm ? "open" : ""}`}>
        <TransactionForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          erro={erro}
        />
      </div>

      <TransactionList
        transacoesFiltradas={transacoesFiltradas}
        remover={remover}
        filtros={filtros}
        setFiltros={setFiltros}
        selecionarTudo={selecionarTudo}
        toggleStatus={toggleStatus}
        getStatusClass={getStatusClass}
      />
    </div>
  );
}

import { Checkbox } from "../Checkbox";

interface Props {
  filtros: {
    entrada: boolean;
    pago: boolean;
    pendente: boolean;
  };
  setFiltros: React.Dispatch<React.SetStateAction<any>>;
  selecionarTudo: () => void;
}

export function TransactionFilters({
  filtros,
  setFiltros,
  selecionarTudo,
}: Props) {
  return (
    <div className="filters">
      <Checkbox
        checked={filtros.entrada && filtros.pago && filtros.pendente}
        onChange={selecionarTudo}
        label="Selecionar Tudo"
      />

      <Checkbox
        checked={filtros.entrada}
        onChange={() => setFiltros({ ...filtros, entrada: !filtros.entrada })}
        label="Entrada"
      />

      <Checkbox
        checked={filtros.pago}
        onChange={() => setFiltros({ ...filtros, pago: !filtros.pago })}
        label="Pago"
      />

      <Checkbox
        checked={filtros.pendente}
        onChange={() => setFiltros({ ...filtros, pendente: !filtros.pendente })}
        label="Pendente"
      />
    </div>
  );
}

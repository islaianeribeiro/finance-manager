import { Input } from "../Input";

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
      <Input
        type="checkbox"
        checked={filtros.entrada && filtros.pago && filtros.pendente}
        onChange={selecionarTudo}
        label="Selecionar Tudo"
      />

      <Input
        type="checkbox"
        checked={filtros.entrada}
        onChange={() => setFiltros({ ...filtros, entrada: !filtros.entrada })}
        label="Entrada"
      />

      <Input
        type="checkbox"
        checked={filtros.pago}
        onChange={() => setFiltros({ ...filtros, pago: !filtros.pago })}
        label="Pago"
      />

      <Input
        type="checkbox"
        checked={filtros.pendente}
        onChange={() => setFiltros({ ...filtros, pendente: !filtros.pendente })}
        label="Pendente"
      />
    </div>
  );
}

import type { Transacao } from "../../hooks/useFinance";
import type { StatusPagamento } from "../../types/finance";
import { Button } from "../Button";

interface Props {
  t: Transacao;
  remover: (id: number) => void;
  toggleStatus: (id: number) => void;
  getStatusClass: (status: StatusPagamento) => string;
}

export function TransactionItem({
  t,
  remover,
  toggleStatus,
  getStatusClass,
}: Props) {
  const dataFormatada = t.data
    ? new Date(t.data).toLocaleDateString("pt-BR")
    : "";

  return (
    <div key={t.id} className={`list-item ${getStatusClass(t.status)}`}>
      {/* ESQUERDA */}
      <div className="left">
        <p className="categoria">{t.categoria}</p>
        <span className="data">{dataFormatada}</span>
        {t.parcelado && <span className="badge">Parcela {t.parcelaAtual}</span>}
      </div>

      {/* DIREITA */}
      <div className="right">
        {t.parcelado ? (
          <span>
            {t.parcelas}x de R$ {t.valor.toFixed(2)}
          </span>
        ) : (
          <p>R$ {t.valor.toFixed(2)}</p>
        )}

        <div className="actions">
          {t.tipo === "saida" ? (
            <Button onClick={() => toggleStatus(t.id)} className="status-btn">
              Alterar
            </Button>
          ) : (
            ""
          )}
          <Button onClick={() => remover(t.id)} className="delete">
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}

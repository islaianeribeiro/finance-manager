export type TipoTransacao = "entrada" | "saida";
export type StatusPagamento = "pago" | "pendente" | "entrada";

export interface FormState {
  tipo: TipoTransacao | "";
  valor: string;
  categoria: string;
  data: string;
  parcelado: boolean;
  parcelas: string;
  parcelaAtual: string;
  status: StatusPagamento | "";
}

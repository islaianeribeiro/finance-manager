import type { ChangeEvent } from "react";
import type { FormState, TipoTransacao } from "../types/finance";
import { Select } from "./Select";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";

interface Props {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  erro: string | null;
}

export function TransactionForm({ form, setForm, onSubmit, erro }: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="transaction-registration">
      <h3>Cadastro de Transações</h3>
      {erro && <p className="erro">{erro}</p>}
      <Select
        value={form.tipo}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            tipo: value as TipoTransacao,
            status: value === "entrada" ? "entrada" : "pago",

            // limpa parcelamento se virar entrada
            parcelado: value === "saida" ? prev.parcelado : false,
            parcelas: value === "saida" ? prev.parcelas : "",
            parcela_atual: value === "saida" ? prev.parcela_atual : "",
          }))
        }
        options={[
          { label: "Tipo", value: "", disabled: true },
          { label: "Entrada", value: "entrada" },
          { label: "Saída", value: "saida" },
        ]}
      />

      <Input
        name="valor"
        type="number"
        placeholder="Valor"
        value={form.valor}
        onChange={handleChange}
        className="input"
      />

      <Input
        name="categoria"
        type="string"
        placeholder="Categoria"
        value={form.categoria}
        onChange={handleChange}
        className="input"
      />

      <div className="date-wrapper">
        {!form.data && (
          <span className="date-placeholder">Selecione uma data</span>
        )}

        <Input
          name="data"
          type="date"
          value={form.data}
          onChange={handleChange}
          className="input"
        />
      </div>

      <Select
        value={
          form.tipo === ""
            ? ""
            : form.tipo === "entrada"
              ? "entrada"
              : form.status
        }
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            status: value as FormState["status"],
          }))
        }
        options={
          form.tipo === ""
            ? [{ label: "Status", value: "", disabled: true }]
            : form.tipo === "entrada"
              ? [
                  { label: "Status", value: "", disabled: true },
                  { label: "Entrada", value: "entrada" },
                ]
              : [
                  { label: "Status", value: "", disabled: true },
                  { label: "Pago", value: "pago" },
                  { label: "Pendente", value: "pendente" },
                ]
        }
      />

      {form.tipo === "saida" && (
        <Checkbox
          checked={form.parcelado}
          onChange={(value) => updateField("parcelado", value)}
          label="Parcelado?"
        />
      )}
      {form.tipo === "saida" && form.parcelado && (
        <Input
          name="parcelas"
          type="number"
          placeholder="Quantas Parcelas?"
          value={form.parcelas}
          onChange={handleChange}
          className="input"
        />
      )}
      {form.tipo === "saida" && form.parcelado && form.parcelas && (
        <Select
          value={form.parcela_atual || ""}
          onChange={(value) => updateField("parcela_atual", value)}
          options={[
            { label: "Parcela Atual", value: "", disabled: true },
            ...Array.from({ length: Number(form.parcelas) }, (_, i) => {
              const n = i + 1;
              return {
                label: `${n}/${form.parcelas}`,
                value: `${n}/${form.parcelas}`,
              };
            }),
          ]}
        />
      )}

      <Button onClick={onSubmit} className="button">
        Adicionar
      </Button>
    </div>
  );
}

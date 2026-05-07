import { useEffect, useMemo, useState } from "react";
import type { FormState } from "../types/finance";
import { API_URL } from "../services/api";

type TipoTransacao = "entrada" | "saida";
type StatusPagamento = "pago" | "pendente" | "entrada";

export interface Transacao {
  id: number;
  tipo: TipoTransacao;
  valor: number;
  categoria: string;
  data: string;
  parcelado: boolean;
  parcelas?: number;
  parcela_atual?: string;
  status: StatusPagamento;
}

interface GraficoItem {
  name: string;
  value: number;
}

export function useFinance() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    entrada: true,
    pago: true,
    pendente: true,
  });

  const selecionarTudo = () => {
    const todosSelecionados =
      filtros.entrada && filtros.pago && filtros.pendente;

    setFiltros({
      entrada: !todosSelecionados,
      pago: !todosSelecionados,
      pendente: !todosSelecionados,
    });
  };

  const [form, setForm] = useState<FormState>({
    tipo: "",
    valor: "",
    categoria: "",
    data: "",
    parcelado: false,
    parcelas: "",
    parcela_atual: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_URL}/transacoes`);
      const data = await res.json();
      setTransacoes(data);
    };

    fetchData();
  }, []);

  const adicionar = async (): Promise<boolean> => {
    if (
      !form.valor ||
      !form.data ||
      !form.tipo ||
      (form.tipo === "saida" && !form.status)
    ) {
      setErro("Preencha todos os campos obrigatórios!");
      return false;
    }

    setErro(null);

    const res = await fetch(`${API_URL}/transacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: form.tipo,
        valor: Number(form.valor),
        categoria: form.categoria,
        data: form.data,
        parcelado: form.parcelado,
        parcelas: form.parcelado ? Number(form.parcelas) : undefined,
        parcela_atual: form.parcelado ? form.parcela_atual : undefined,
        status: form.tipo === "entrada" ? "entrada" : form.status,
      }),
    });

    const data = await res.json();

    setTransacoes((prev) => [data[0], ...prev]);

    setForm({
      tipo: "",
      valor: "",
      categoria: "",
      data: "",
      parcelado: false,
      parcelas: "",
      parcela_atual: "",
      status: "",
    });

    return true;
  };

  const remover = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Não foi possível remover a transação");
    }
  };

  const toggleStatus = async (id: number) => {
    const transacao = transacoes.find((t) => t.id === id);

    if (!transacao) return;
    if (transacao.tipo === "entrada") return;

    const novoStatus = transacao.status === "pago" ? "pendente" : "pago";

    await fetch(`${API_URL}/transacoes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: novoStatus,
      }),
    });

    setTransacoes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: novoStatus } : t)),
    );
  };

  const transacoesDoMes = useMemo(() => {
    if (!mesFiltro) return transacoes;
    return transacoes.filter((t) => t.data.startsWith(mesFiltro));
  }, [transacoes, mesFiltro]);

  const transacoesFiltradas = useMemo(() => {
    return transacoesDoMes.filter((t) => {
      if (t.tipo === "entrada") return filtros.entrada;
      if (t.status === "pago") return filtros.pago;
      if (t.status === "pendente") return filtros.pendente;
      return true;
    });
  }, [transacoesDoMes, filtros]);

  const entradas = transacoesDoMes.filter((t) => t.tipo === "entrada");
  const saidas = transacoesDoMes.filter((t) => t.tipo === "saida");

  // totais
  const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  // gráfico
  const gastosPorCategoria = useMemo<GraficoItem[]>(() => {
    return saidas.reduce<GraficoItem[]>((acc, t) => {
      const existente = acc.find((item) => item.name === t.categoria);

      if (existente) existente.value += t.valor;
      else acc.push({ name: t.categoria, value: t.valor });

      return acc;
    }, []);
  }, [saidas]);

  const resumoData: GraficoItem[] = [
    { name: "Entradas", value: totalEntradas },
    { name: "Saídas", value: totalSaidas },
  ];

  const getStatusClass = (status: StatusPagamento) => {
    if (status === "entrada") return "status-entrada";
    if (status === "pago") return "status-pago";
    return "status-pendente";
  };

  return {
    form,
    setForm,
    mesFiltro,
    setMesFiltro,
    adicionar,
    erro,
    remover,
    toggleStatus,
    filtros,
    setFiltros,
    selecionarTudo,
    transacoesDoMes,
    transacoesFiltradas,
    totalEntradas,
    totalSaidas,
    saldo,
    gastosPorCategoria,
    resumoData,
    getStatusClass,
  };
}

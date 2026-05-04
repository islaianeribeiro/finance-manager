import { useEffect, useMemo, useState } from "react";
import type { FormState } from "../types/finance";

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
  parcelaAtual?: string;
  status: StatusPagamento;
}

interface GraficoItem {
  name: string;
  value: number;
}

export function useFinance() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");

  // FILTROS (checkbox)
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
    parcelaAtual: "",
    status: "",
  });

  // storage
  useEffect(() => {
    const data = localStorage.getItem("transacoes");
    if (data) setTransacoes(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  // ações
  const adicionar = () => {
    if (
      !form.valor ||
      !form.data ||
      !form.tipo ||
      (form.tipo === "saida" && !form.status)
    )
      return;

    const nova: Transacao = {
      id: Date.now(),
      tipo: form.tipo,
      valor: Number(form.valor),
      categoria: form.categoria,
      data: form.data,
      parcelado: form.parcelado,
      parcelas: form.parcelado ? Number(form.parcelas) : undefined,
      parcelaAtual: form.parcelado ? String(form.parcelaAtual) : undefined,
      status:
        form.tipo === "entrada" ? "entrada" : (form.status as StatusPagamento),
    };

    setTransacoes((prev) => [nova, ...prev]);

    setForm({
      tipo: "",
      valor: "",
      categoria: "",
      data: "",
      parcelado: false,
      parcelas: "",
      parcelaAtual: "",
      status: "",
    });
  };

  const remover = (id: number) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  // STATUS TOGGLE (apenas saída)
  const toggleStatus = (id: number) => {
    setTransacoes((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.tipo === "entrada") return t;
        return {
          ...t,
          status: t.status === "pago" ? "pendente" : "pago",
        };
      }),
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
    if (status === "pago") return "status-pago";
    if (status === "entrada") return "status-entrada";
    return "status-pendente";
  };

  return {
    form,
    setForm,
    mesFiltro,
    setMesFiltro,
    adicionar,
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

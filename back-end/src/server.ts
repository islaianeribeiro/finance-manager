import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { supabase } from "./lib/supabase.js";

const app = Fastify();

await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

app.get("/", async () => {
  return { ok: true };
});

app.get("/transacoes", async (request, reply) => {
  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .order("data", { ascending: false });

  if (error) {
    return reply.status(500).send({
      error: error.message,
    });
  }

  return reply.send(data ?? []);
});

app.post("/transacoes", async (request, reply) => {
  const body = request.body as any;

  if (!body.valor || !body.data || !body.tipo) {
    return reply.status(400).send({ error: "Campos obrigatórios faltando" });
  }

  if (body.tipo === "saida" && !body.status) {
    return reply.status(400).send({
      error: "Transações de saída precisam de status",
    });
  }

  const { data, error } = await supabase
    .from("transacoes")
    .insert({
      tipo: body.tipo,
      valor: body.valor,
      categoria: body.categoria,
      data: body.data,
      parcelado: body.parcelado,
      parcelas: body.parcelas,
      parcela_atual: body.parcela_atual,
      status: body.status,
    })
    .select();

  if (error) {
    return reply.status(400).send({ error: error.message });
  }

  return reply.send(data);
});

app.put("/transacoes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { status } = request.body as { status: "pago" | "pendente" };

  if (!["pago", "pendente"].includes(status)) {
    return reply.status(400).send({ error: "Status inválido" });
  }

  const { data, error } = await supabase
    .from("transacoes")
    .update({ status })
    .eq("id", id)
    .eq("tipo", "saida")
    .select();

  if (error) {
    return reply.status(400).send({ error: error.message });
  }

  if (!data || data.length === 0) {
    return reply.status(404).send({
      error: "Transação não encontrada ou não é do tipo saída",
    });
  }

  return reply.send(data);
});

app.delete("/transacoes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  const { error } = await supabase.from("transacoes").delete().eq("id", id);

  if (error) {
    return reply.status(400).send({ error: error.message });
  }

  return reply.send({ success: true });
});

app.listen({
  port: Number(process.env.PORT) || 3333,
  host: "0.0.0.0",
});

import { useEffect, useState } from "react";
import { X, Check, ArrowRight, Info } from "lucide-react";
import {
  GRUPOS,
  MOTO_PRECOS,
  FIDELIDADE,
  brl,
  num,
  type Grupo,
} from "@/lib/data";
import {
  PLANOS_OPEN_EVENT,
  GRUPO_CATEGORIA,
  abrirChat,
  type PlanosOpenDetail,
} from "@/lib/chatbot";

// Cores por faixa de km (espelham o site oficial: azul / laranja / verde).
const TIER = [
  { head: "bg-sky-700", price: "text-sky-700", ring: "ring-sky-700/20" },
  { head: "bg-orange-500", price: "text-orange-600", ring: "ring-orange-500/20" },
  { head: "bg-emerald-600", price: "text-emerald-700", ring: "ring-emerald-600/20" },
];

const CAR_GROUPS: Grupo[] = ["C", "D", "DS"];

export default function PlanDetails() {
  const [open, setOpen] = useState(false);
  const [grupo, setGrupo] = useState<Grupo | undefined>(undefined);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = ((e as CustomEvent<PlanosOpenDetail>).detail ?? {}) as PlanosOpenDetail;
      setGrupo(detail.grupo);
      setOpen(true);
    };
    window.addEventListener(PLANOS_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PLANOS_OPEN_EVENT, onOpen);
  }, []);

  // Fecha com ESC e trava o scroll do fundo enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Quais grupos de carro exibir (um específico, ou todos quando veio da seção de planos).
  const carGroups = grupo && grupo !== "Moto" ? [grupo] : grupo === "Moto" ? [] : CAR_GROUPS;
  const showMoto = !grupo || grupo === "Moto";
  const showFidelidade = !grupo; // visão geral

  const cadastrar = () => {
    setOpen(false);
    abrirChat(grupo ? { categoria: GRUPO_CATEGORIA[grupo] } : {});
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes dos planos e franquias"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-sheet flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-neutral-50 shadow-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Planos & franquias
            </p>
            <h3 className="font-display text-lg font-bold text-charcoal">
              {grupo && grupo !== "Moto"
                ? `Grupo ${grupo} — ${GRUPOS[grupo].nome}`
                : grupo === "Moto"
                ? "Moto — Honda CG 160 Start"
                : "Tabela de preços"}
            </h3>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-lg p-1.5 text-charcoal/50 transition hover:bg-charcoal/5 hover:text-charcoal"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-5 py-6">
          {carGroups.map((g) => (
            <GrupoBloco key={g} grupo={g} soUm={carGroups.length === 1} />
          ))}

          {showMoto && <MotoBloco soTitulo={grupo === "Moto"} />}

          {showFidelidade && <FidelidadeBloco />}

          <div className="flex items-start gap-2 rounded-xl bg-brand/5 px-4 py-3 text-xs leading-relaxed text-charcoal/70 ring-1 ring-brand/15">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>
              {carGroups.length > 0 &&
                "Planos dos carros são semanais para motoristas de aplicativo. A apuração da quilometragem é feita a cada 4 semanas; o excedente é cobrado por fatura/boleto. "}
              Sem agendamento de retirada — cadastre-se e retire na loja assim que a
              disponibilidade for confirmada.
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-charcoal/10 bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4">
          <button onClick={cadastrar} className="btn-primary w-full text-base">
            Fazer meu cadastro <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GrupoBloco({ grupo, soUm }: { grupo: Grupo; soUm: boolean }) {
  const g = GRUPOS[grupo];
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        {soUm ? (
          <p className="text-sm text-charcoal/55">{g.exemplos}</p>
        ) : (
          <h4 className="font-display text-base font-bold text-charcoal">
            Grupo {grupo} — {g.nome}
            <span className="ml-2 text-sm font-normal text-charcoal/50">{g.exemplos}</span>
          </h4>
        )}
        <span className="text-sm font-semibold text-charcoal/70">Caução: {brl(g.caucao)}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {g.franquias.map((f, i) => (
          <div
            key={f.km}
            className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 ${TIER[i].ring}`}
          >
            <div className={`px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white ${TIER[i].head}`}>
              Plano semanal {num(f.km)}
            </div>
            <div className="px-3 py-3 text-center">
              <p className="text-sm text-charcoal/55">{num(f.km)} km/semana</p>
              <p className={`font-display text-2xl font-extrabold ${TIER[i].price}`}>
                {brl(f.semana)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-charcoal/50">
        Caução parcelável em até 12x no cartão de crédito.
      </p>
    </section>
  );
}

function MotoBloco({ soTitulo }: { soTitulo: boolean }) {
  const linhas = [
    { nome: "Diária", valor: MOTO_PRECOS.diaria, unidade: "/dia", nota: "km livre • máx. 6 diárias" },
    { nome: "Semanal", valor: MOTO_PRECOS.semanal, unidade: "/sem", nota: "franquia 1.000 km" },
    { nome: "Mensal", valor: MOTO_PRECOS.mensal, unidade: "/mês", nota: "franquia 4.000 km" },
  ];
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        {soTitulo ? (
          <span />
        ) : (
          <h4 className="font-display text-base font-bold text-charcoal">
            Moto — Honda CG 160 Start
          </h4>
        )}
        <span className="text-sm font-semibold text-charcoal/70">
          Caução: {brl(MOTO_PRECOS.caucao)}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {linhas.map((l, i) => (
          <div
            key={l.nome}
            className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 ${TIER[i].ring}`}
          >
            <div className={`px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white ${TIER[i].head}`}>
              {l.nome}
            </div>
            <div className="px-3 py-3 text-center">
              <p className={`font-display text-2xl font-extrabold ${TIER[i].price}`}>
                {brl(l.valor)}
                <span className="text-sm font-medium text-charcoal/50">{l.unidade}</span>
              </p>
              <p className="mt-0.5 text-xs text-charcoal/55">{l.nota}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FidelidadeBloco() {
  return (
    <section className="rounded-xl bg-ink px-5 py-5 text-white">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-grad px-3 py-1 text-xs font-bold uppercase tracking-wide">
          O veículo fica seu
        </span>
        <h4 className="font-display text-base font-bold">Plano Fidelidade</h4>
      </div>
      <p className="mt-2 text-sm text-white/70">
        Ao final do contrato, o veículo é transferido para você — paga pelo que será seu.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-sm font-semibold">🚗 Carro (ex.: {FIDELIDADE.carro.modelo})</p>
          <p className="mt-1 text-sm text-white/70">
            Plano de {FIDELIDADE.carro.meses} meses • {brl(FIDELIDADE.carro.diaria)}/dia
          </p>
          <p className="text-sm text-white/70">Caução {brl(FIDELIDADE.carro.caucao)}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-sm font-semibold">🏍️ Moto CG 160 Start</p>
          <ul className="mt-1 space-y-0.5 text-sm text-white/70">
            {FIDELIDADE.moto.map((m) => (
              <li key={m.plano} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand" />
                {m.plano}: {brl(m.semanal)}/sem
              </li>
            ))}
          </ul>
          <p className="mt-1 text-sm text-white/70">Caução {brl(FIDELIDADE.motoCaucao)} em 12x</p>
        </div>
      </div>
    </section>
  );
}

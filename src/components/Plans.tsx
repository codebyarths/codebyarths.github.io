import { Check, Table2 } from "lucide-react";
import { PLANS } from "@/lib/data";
import { abrirChat, abrirPlanos } from "@/lib/chatbot";
import Reveal from "./Reveal";

const PLANOS_SECAO = PLANS.filter((p) => p.naSecao);

export default function Plans() {
  return (
    <section id="planos" className="section bg-neutral-50">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Planos & Assinatura</span>
          <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
            Escolha o formato que cabe na sua rotina
          </h2>
          <p className="mt-4 text-charcoal/60">
            Do plano semanal para motoristas de app ao plano Fidelidade, em que o veículo
            fica seu — você no controle, sem surpresas.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-7 sm:grid-cols-2">
          {PLANOS_SECAO.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-8 transition ${
                  p.highlight
                    ? "bg-ink text-white shadow-card ring-2 ring-brand"
                    : "bg-white text-charcoal shadow-card ring-1 ring-charcoal/10"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-grad px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    {p.tag ?? "Mais escolhido"}
                  </span>
                )}

                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className={`mt-1 text-sm ${p.highlight ? "text-white/60" : "text-charcoal/55"}`}>
                  {p.description}
                </p>

                {p.pricePrefix && (
                  <p
                    className={`mt-6 text-xs font-medium ${
                      p.highlight ? "text-white/55" : "text-charcoal/45"
                    }`}
                  >
                    {p.pricePrefix}
                  </p>
                )}
                <div className={`flex items-end gap-1 ${p.pricePrefix ? "mt-0.5" : "mt-6"}`}>
                  <span className="font-display text-4xl font-extrabold">{p.priceLabel}</span>
                  <span className={`pb-1 text-sm ${p.highlight ? "text-white/60" : "text-charcoal/50"}`}>
                    {p.unit}
                  </span>
                </div>

                <ul
                  className={`mt-6 flex-1 space-y-3 border-t pt-6 text-sm ${
                    p.highlight ? "border-white/10" : "border-charcoal/10"
                  }`}
                >
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className={p.highlight ? "text-white/85" : "text-charcoal/75"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => abrirChat({ plano: p.name })}
                  className={`mt-8 ${p.highlight ? "btn-primary" : "btn-ghost"} w-full`}
                >
                  {p.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <button
            onClick={() => abrirPlanos()}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-brand hover:text-brand"
          >
            <Table2 className="h-4 w-4" />
            Ver tabela completa de franquias e caução
          </button>
        </Reveal>
      </div>
    </section>
  );
}

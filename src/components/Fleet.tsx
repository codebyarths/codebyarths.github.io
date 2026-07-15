import { useState } from "react";
import { Users, Cog, Fuel, MessageSquare, ListChecks } from "lucide-react";
import { FLEET, GRUPOS, precoCard, type Vehicle } from "@/lib/data";
import { abrirChat, abrirPlanos } from "@/lib/chatbot";
import { asset } from "@/lib/asset";
import Reveal from "./Reveal";

const CATEGORIES = ["Todos", ...Array.from(new Set(FLEET.map((v) => v.category)))];

export default function Fleet() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? FLEET : FLEET.filter((v) => v.category === active);

  // Interesse no veículo abre o assistente virtual com o modelo já selecionado.
  const interesse = (v: Vehicle) => abrirChat({ veiculo: v.short });

  return (
    <section id="frota" className="section bg-neutral-50">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Nossa frota</span>
          <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
            Escolha o veículo ideal para cada momento
          </h2>
          <p className="mt-4 text-charcoal/60">
            Carros novos, revisados e higienizados. Do compacto econômico ao sedan completo,
            mais a CG 160 para quem trabalha na rua.
          </p>
        </Reveal>

        {/* Filtros */}
        <Reveal className="mt-8 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === cat
                  ? "bg-ink text-white shadow"
                  : "bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:text-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {/* Cards */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v, i) => (
            <Reveal key={v.name} delay={i * 70}>
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 transition hover:-translate-y-1 ${
                  v.highlight ? "ring-2 ring-brand" : "ring-charcoal/5"
                }`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={asset(v.image)}
                    alt={v.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {v.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-brand-grad px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                      {v.badge}
                    </span>
                  )}
                  <span className="absolute right-3 top-4 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
                    Imagem ilustrativa
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-xs font-medium uppercase tracking-wider text-white/90">
                    {v.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-charcoal">{v.name}</h3>

                  <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-charcoal/60">
                    <Spec icon={<Users className="h-4 w-4" />} label={`${v.seats} lugares`} />
                    <Spec icon={<Cog className="h-4 w-4" />} label={v.transmission} />
                    <Spec icon={<Fuel className="h-4 w-4" />} label={v.fuel} />
                  </ul>

                  <div className="mt-5 border-t border-charcoal/10 pt-4">
                    {(() => {
                      const p = precoCard(v);
                      return (
                        <>
                          <div className="mb-1 flex items-end justify-between">
                            <div>
                              <p className="text-[11px] text-charcoal/50">a partir de</p>
                              <p className="font-display text-2xl font-extrabold leading-none text-charcoal">
                                {p.value}
                                <span className="text-sm font-medium text-charcoal/50">{p.unit}</span>
                              </p>
                            </div>
                            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                              {p.note}
                            </span>
                          </div>
                          <p className="mb-3 text-[11px] text-charcoal/45">
                            Caução {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(GRUPOS[v.group].caucao)}
                          </p>
                        </>
                      );
                    })()}
                    <button onClick={() => interesse(v)} className="btn-primary w-full py-2.5">
                      Tenho interesse <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => abrirPlanos({ grupo: v.group })}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold text-brand-700 transition hover:text-brand"
                    >
                      <ListChecks className="h-4 w-4" />
                      Ver planos e franquias
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <p className="mx-auto max-w-2xl text-sm text-charcoal/55">
            Carros em planos semanais para motoristas de app (franquia a partir de 1.250 km/sem);
            moto CG 160 a partir de R$ 55/dia. Sem agendamento de retirada — faça seu cadastro
            com o assistente e retire na loja assim que a disponibilidade for confirmada.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex flex-col items-center gap-1 rounded-lg bg-neutral-50 py-2 text-center">
      <span className="text-brand">{icon}</span>
      <span className="leading-tight">{label}</span>
    </li>
  );
}

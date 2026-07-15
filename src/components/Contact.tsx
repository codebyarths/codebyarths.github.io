import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight, Bot } from "lucide-react";
import { COMPANY, WHATSAPP } from "@/lib/data";
import { abrirChat } from "@/lib/chatbot";
import Reveal from "./Reveal";

const PASSOS = [
  "Responda algumas perguntas rápidas no chat",
  "Seus dados vão direto para a nossa equipe",
  "Você é levado ao WhatsApp para confirmar",
];

export default function Contact() {
  const infos = [
    { icon: Phone, label: "Telefone / WhatsApp", value: COMPANY.phone, href: `tel:+${COMPANY.phoneRaw}` },
    { icon: Mail, label: "E-mail", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: MapPin, label: "Endereço", value: COMPANY.address },
    { icon: Clock, label: "Horário", value: COMPANY.hours },
  ];

  return (
    <section id="contato" className="section bg-neutral-50">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        {/* Info */}
        <Reveal>
          <span className="eyebrow">Fale com a gente</span>
          <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
            Pronto para reservar seu veículo?
          </h2>
          <p className="mt-4 text-charcoal/60">
            Nossa equipe está à disposição para encontrar o carro ou a moto ideal para você.
            Atendimento rápido e sem complicação.
          </p>

          <div className="mt-8 space-y-4">
            {infos.map((info) => {
              const Icon = info.icon;
              const content = (
                <div className="flex items-start gap-4 rounded-xl border border-charcoal/10 bg-white p-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">
                      {info.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-charcoal">{info.value}</p>
                  </div>
                </div>
              );
              return info.href ? (
                <a key={info.label} href={info.href} className="block transition hover:opacity-80">
                  {content}
                </a>
              ) : (
                <div key={info.label}>{content}</div>
              );
            })}
          </div>
          <p className="mt-5 text-xs text-charcoal/45">CNPJ: {COMPANY.cnpj}</p>
        </Reveal>

        {/* Solicite um orçamento — pelo assistente do chat */}
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-center rounded-2xl bg-ink p-7 text-white shadow-card sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-grad">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold">Solicite um orçamento</h3>
            <p className="mt-2 text-white/70">
              Faça seu pedido pelo nosso assistente virtual — é rapidinho e sem formulário. Ele
              cuida de tudo e te conecta com a equipe.
            </p>

            <ul className="mt-6 space-y-3">
              {PASSOS.map((p, i) => (
                <li key={p} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-grad text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <button onClick={() => abrirChat()} className="btn-primary mt-8 w-full text-base">
              Solicitar orçamento no chat <MessageSquare className="h-4 w-4" />
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold text-white/70 transition hover:text-brand"
            >
              Prefiro falar direto no WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

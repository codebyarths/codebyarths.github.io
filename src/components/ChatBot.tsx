import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MessageSquare, X, Send, RotateCcw, Bot, ExternalLink } from "lucide-react";
import { FLEET } from "@/lib/data";
import { enviarEmailLoja } from "@/lib/email";
import {
  WELCOME,
  INITIAL_SUGGESTIONS,
  FALLBACK_ANSWER,
  CADASTRO_STEPS,
  CHAT_OPEN_EVENT,
  matchIntent,
  isCadastroTrigger,
  cadastroToWhats,
  cadastroToEmail,
  cadastroResumo,
  whatsLink,
  salvarCadastro,
  stepOptions,
  stepQuestion,
  proximoPasso,
  type CadastroData,
  type ChatOpenDetail,
} from "@/lib/chatbot";

type Msg = {
  id: number;
  role: "bot" | "user";
  content: string;
  suggestions?: string[];
};

type Mode = "chat" | "cadastro" | "done";

let idSeq = 1;
const nextId = () => idSeq++;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [teaserDone, setTeaserDone] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CadastroData>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<CadastroData>({});
  dataRef.current = data;

  // Rolagem INSTANTÂNEA até a última mensagem (animação "smooth" é interrompida
  // pelo teclado no mobile, deixando a conversa parada no meio).
  const rolaParaFim = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Mobile: chat em tela cheia + ajuste à área visível quando o teclado abre.
  // Sem isso, o teclado "empurra" a janela fixa para fora da tela (perde o input).
  useEffect(() => {
    if (!open) return;
    const el = windowRef.current;
    const vv = window.visualViewport;
    if (!el) return;

    const ajusta = () => {
      // Só interfere no mobile E com o teclado aberto (área visível bem menor
      // que a janela). Sem teclado, o CSS (inset-0) cuida do layout sozinho.
      const tecladoAberto = !!vv && vv.height < window.innerHeight - 80;
      if (window.innerWidth >= 640 || !vv || !tecladoAberto) {
        el.style.height = "";
        el.style.transform = "";
        return;
      }
      // Altura visível real (desconta o teclado) + compensa o "pan" do iOS.
      el.style.height = `${vv.height}px`;
      el.style.transform = `translateY(${vv.offsetTop}px)`;
      rolaParaFim();
    };

    ajusta();
    vv?.addEventListener("resize", ajusta);
    vv?.addEventListener("scroll", ajusta);
    window.addEventListener("resize", ajusta);

    // Trava o scroll da página atrás do chat (só no mobile/tela cheia).
    const eraMobile = window.innerWidth < 640;
    const overflowAnterior = document.body.style.overflow;
    if (eraMobile) document.body.style.overflow = "hidden";

    return () => {
      vv?.removeEventListener("resize", ajusta);
      vv?.removeEventListener("scroll", ajusta);
      window.removeEventListener("resize", ajusta);
      el.style.height = "";
      el.style.transform = "";
      if (eraMobile) document.body.style.overflow = overflowAnterior;
    };
  }, [open]);

  // Teaser: aparece após alguns segundos e some sozinho (uma única vez).
  useEffect(() => {
    if (teaserDone) return;
    const show = setTimeout(() => setTeaser(true), 4000);
    const hide = setTimeout(() => {
      setTeaser(false);
      setTeaserDone(true);
    }, 11000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [teaserDone]);

  // Mensagem de boas-vindas ao abrir pela primeira vez.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: nextId(), role: "bot", content: WELCOME, suggestions: INITIAL_SUGGESTIONS },
      ]);
    }
    if (open) {
      setTeaser(false);
      setTeaserDone(true);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll: instantâneo (sem animação interrompível) e em três passadas —
  // a imediata (pós-DOM) e duas de reforço para quando o layout assenta depois
  // (indicador de digitação vira mensagem, teclado abre/fecha no mobile).
  useLayoutEffect(() => {
    rolaParaFim();
    const t1 = setTimeout(rolaParaFim, 60);
    const t2 = setTimeout(rolaParaFim, 220);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [messages, typing]);

  const pushUser = (content: string) =>
    setMessages((m) => [...m, { id: nextId(), role: "user", content }]);

  const pushBot = (content: string, suggestions?: string[]) =>
    setMessages((m) => [...m, { id: nextId(), role: "bot", content, suggestions }]);

  const botSay = (content: string, suggestions?: string[], delay = 480) => {
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), role: "bot", content, suggestions }]);
      setTyping(false);
    }, delay);
  };

  const startCadastro = (prefill: CadastroData = {}, intro?: string) => {
    const first = proximoPasso(prefill);
    if (first === -1) return; // nunca acontece: cadastro sempre tem passos em aberto
    setMode("cadastro");
    setStep(first);
    setData(prefill);
    const s = CADASTRO_STEPS[first];
    const abertura = intro ?? "Perfeito! Vou fazer seu cadastro rapidinho. 📝";
    botSay(`${abertura}\n\n${stepQuestion(s, prefill)}`, stepOptions(s, prefill));
  };

  // Abertura do chat a partir dos cards da frota / hero, com pré-seleção.
  useEffect(() => {
    const onOpenChat = (e: Event) => {
      const detail = ((e as CustomEvent<ChatOpenDetail>).detail ?? {}) as ChatOpenDetail;
      setOpen(true);
      const prefill: CadastroData = {};
      let intro: string | undefined;
      if (detail.veiculo) {
        const v = FLEET.find((f) => f.short === detail.veiculo || f.name === detail.veiculo);
        if (v) {
          prefill.veiculo = v.short;
          prefill.categoria = v.category;
          intro = `**${v.name}** é uma ótima escolha! ${
            v.category === "Motos" ? "🏍️" : "🚗"
          } Vou fazer seu cadastro rapidinho e te levar para o WhatsApp da loja. 📝`;
        }
      } else if (detail.categoria) {
        prefill.categoria = detail.categoria;
        intro = `Boa! Vou fazer seu cadastro para a categoria **${detail.categoria}**. 📝`;
      }
      if (detail.plano) {
        prefill.plano = detail.plano;
        intro ??= `Boa escolha! Vou fazer seu cadastro para o plano **${detail.plano}**. 📝`;
      }
      startCadastro(prefill, intro);
    };
    window.addEventListener(CHAT_OPEN_EVENT, onOpenChat);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpenChat);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finalize = (finalData: CadastroData) => {
    salvarCadastro(finalData);
    setMode("done");
    botSay(cadastroResumo(finalData), undefined, 520);
    // Envio automático dos dados para o e-mail da loja (em paralelo ao WhatsApp).
    enviarEmailLoja(
      `Novo cadastro pelo site — ${finalData.veiculo ?? "veículo a definir"}`,
      cadastroToEmail(finalData)
    ).then((ok) => {
      pushBot(
        ok
          ? "📧 Seus dados também já foram enviados para o e-mail da nossa equipe!"
          : "⚠️ Não consegui enviar o e-mail automático agora, mas sem problemas — finalize pelo WhatsApp que a equipe recebe tudo."
      );
    });
  };

  const handleCadastro = async (text: string) => {
    const current = CADASTRO_STEPS[step];
    const err = current.validate?.(text, dataRef.current);
    if (err) {
      botSay(err, stepOptions(current, dataRef.current));
      return;
    }
    const valor = current.transform
      ? current.transform(text.trim(), dataRef.current)
      : text.trim();
    let patch: CadastroData = { [current.key]: valor };

    // Hook assíncrono (ex.: buscar CEP na ViaCEP) com "digitando..." durante a consulta.
    if (current.resolve) {
      setTyping(true);
      let resultado: { patch?: CadastroData; erro?: string };
      try {
        resultado = await current.resolve(valor, dataRef.current);
      } catch {
        resultado = {};
      }
      setTyping(false);
      if (resultado.erro) {
        botSay(resultado.erro, stepOptions(current, dataRef.current));
        return;
      }
      if (resultado.patch) patch = { ...patch, ...resultado.patch };
    }

    const updated = { ...dataRef.current, ...patch };
    setData(updated);
    const next = proximoPasso(updated, step + 1);
    if (next === -1) {
      finalize(updated);
    } else {
      setStep(next);
      const ns = CADASTRO_STEPS[next];
      botSay(stepQuestion(ns, updated), stepOptions(ns, updated));
    }
  };

  const handleChat = (text: string) => {
    if (isCadastroTrigger(text)) {
      startCadastro();
      return;
    }
    const intent = matchIntent(text);
    if (intent) {
      botSay(intent.answer, intent.suggestions);
    } else {
      botSay(FALLBACK_ANSWER, ["Falar no WhatsApp", "Quero alugar", "Preços"]);
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    pushUser(text);
    setInput("");

    // "Falar no WhatsApp" é uma ação direta em qualquer modo.
    if (text.toLowerCase().includes("whatsapp")) {
      window.open(whatsLink("Olá! Vim pelo site e gostaria de atendimento."), "_blank");
      botSay("Abri o WhatsApp para você falar com a nossa equipe. 📲 Posso ajudar em mais algo?", [
        "Quero alugar",
        "Preços",
      ]);
      return;
    }

    if (mode === "cadastro") handleCadastro(text);
    else handleChat(text);
  };

  const resetChat = () => {
    setMessages([
      { id: nextId(), role: "bot", content: WELCOME, suggestions: INITIAL_SUGGESTIONS },
    ]);
    setMode("chat");
    setStep(0);
    setData({});
    setInput("");
  };

  const enviarCadastroWhats = () => {
    window.open(whatsLink(cadastroToWhats(dataRef.current)), "_blank");
    botSay("Perfeito! Te esperamos. 🚗💨 Qualquer dúvida, é só chamar por aqui.", [
      "Fazer outro cadastro",
    ]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send(input);
    }
  };

  const totalPassos = CADASTRO_STEPS.filter((s) => !s.skip?.(data)).length;
  const respondidos = CADASTRO_STEPS.filter((s) => data[s.key] !== undefined).length;
  const progresso =
    mode === "cadastro" ? Math.round((respondidos / totalPassos) * 100) : 0;

  return (
    <>
      {/* Janela do chat — tela cheia no mobile; flutuante no desktop */}
      {open && (
        <div
          ref={windowRef}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:right-6 sm:h-[min(620px,calc(100vh-8rem))] sm:w-[min(384px,calc(100vw-2.5rem))] sm:rounded-2xl sm:border sm:border-charcoal/10 sm:shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-ink px-4 pb-3.5 pt-[calc(0.875rem+env(safe-area-inset-top))] text-white sm:pt-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-grad">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink bg-green-400" />
              </div>
              <div>
                <p className="font-display text-sm font-bold leading-tight">Assistente MCM</p>
                <p className="text-[11px] leading-tight text-white/60">Online • responde na hora</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                title="Reiniciar conversa"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Barra de progresso do cadastro */}
          {mode === "cadastro" && (
            <div className="h-1 w-full bg-neutral-100">
              <div
                className="h-full bg-brand-grad transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          )}

          {/* Mensagens */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-neutral-50 px-3.5 py-4"
          >
            {messages.map((m) => (
              <div key={m.id}>
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-ink text-white"
                        : "rounded-bl-md bg-white text-charcoal shadow-sm ring-1 ring-charcoal/5"
                    }`}
                  >
                    <RichText text={m.content} />
                  </div>
                </div>
                {/* Sugestões / opções */}
                {m.role === "bot" && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        disabled={typing}
                        className="rounded-full border border-brand/40 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand hover:text-white disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-charcoal/5">
                  <Dot /> <Dot delay={150} /> <Dot delay={300} />
                </div>
              </div>
            )}
          </div>

          {/* Rodapé: ação final do cadastro ou input */}
          {mode === "done" ? (
            <div className="space-y-2 border-t border-charcoal/10 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
              <button onClick={enviarCadastroWhats} className="btn-primary w-full">
                Continuar no WhatsApp <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={resetChat}
                className="w-full rounded-full py-2 text-xs font-semibold text-charcoal/55 transition hover:text-brand"
              >
                Fazer novo cadastro
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-2 border-t border-charcoal/10 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setTimeout(rolaParaFim, 250)}
                inputMode={
                  mode === "cadastro" ? CADASTRO_STEPS[step]?.inputMode ?? "text" : "text"
                }
                placeholder={
                  mode === "cadastro" ? "Digite sua resposta..." : "Escreva sua mensagem..."
                }
                disabled={typing}
                className="h-11 flex-1 rounded-xl border border-charcoal/15 bg-white px-3.5 text-base text-charcoal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
              />
              <button
                onClick={() => send(input)}
                disabled={typing || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-grad text-white shadow-glow transition hover:brightness-105 disabled:opacity-40"
                aria-label="Enviar"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Teaser (dispensável e some sozinho) */}
      {teaser && !open && (
        <div className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-5 z-40 max-w-[230px] animate-fade-up sm:right-6">
          <button
            onClick={() => setOpen(true)}
            className="block rounded-2xl rounded-br-md bg-white px-4 py-3 pr-5 text-left text-sm text-charcoal shadow-card ring-1 ring-charcoal/10"
          >
            <span className="font-semibold">Olá! 👋</span> Posso te ajudar a alugar ou tirar dúvidas?
          </button>
          <button
            onClick={() => {
              setTeaser(false);
              setTeaserDone(true);
            }}
            aria-label="Dispensar"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white shadow ring-2 ring-white transition hover:bg-graphite"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Botão flutuante (no mobile some enquanto o chat ocupa a tela toda) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`${
          open ? "hidden sm:flex" : "flex"
        } fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 h-16 w-16 items-center justify-center rounded-full bg-brand-grad text-white shadow-glow transition hover:scale-105 sm:right-6`}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
      >
        {open ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <MessageSquare className="h-7 w-7" />
            <span className="absolute right-0 top-0 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-green-500" />
            </span>
          </>
        )}
      </button>
    </>
  );
}

/** Renderiza texto com **negrito** e quebras de linha, sem HTML perigoso. */
function RichText({ text }: { text: string }): ReactNode {
  return (
    <>
      {text.split("\n").map((line, i) => {
        if (line === "") return <span key={i} className="block h-2" />;
        return (
          <span key={i} className="block">
            {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
                return <em key={j}>{part.slice(1, -1)}</em>;
              }
              return <span key={j}>{part}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-charcoal/30"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// Motor do chatbot local da MCM Rent a Car.
// Base de conhecimento + correspondência de intenções (sem backend / sem IA externa)
// e a definição do fluxo conversacional de cadastro do cliente.

import {
  COMPANY,
  FLEET,
  PLANS,
  CATEGORIES,
  GRUPOS,
  MOTO_PRECOS,
  FIDELIDADE,
  modelosDa,
  brl,
  type Grupo,
} from "./data";

export { CATEGORIES };

// Tabela de preços dos carros (planos semanais por grupo) montada para o chat.
const precosCarros = (["C", "D", "DS"] as const)
  .map((g) => {
    const grp = GRUPOS[g];
    return `• **${grp.nome}** (${grp.exemplos}): a partir de ${brl(grp.franquias[0].semana)}/sem`;
  })
  .join("\n");

/** Normaliza texto: minúsculas, sem acentos, sem pontuação, espaços colapsados. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type Intent = {
  id: string;
  keywords: string[];
  answer: string;
  suggestions?: string[];
};

const frotaLista = CATEGORIES.map((cat) => `• **${cat}:** ${modelosDa(cat).join(", ")}`).join("\n");

/** Frases que disparam o início do cadastro em vez de uma resposta de FAQ. */
export const CADASTRO_TRIGGERS = [
  "quero alugar",
  "fazer cadastro",
  "fazer um cadastro",
  "quero me cadastrar",
  "cadastrar",
  "cadastro",
  "reservar",
  "fazer reserva",
  "quero reservar",
  "alugar um carro",
  "alugar uma moto",
  "contratar",
  "quero um carro",
  "tenho interesse",
];

export const INTENTS: Intent[] = [
  {
    id: "saudacao",
    keywords: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "e ai", "hey", "opa"],
    answer:
      "Olá! 👋 Seja bem-vindo(a) à MCM Rent a Car. Posso te ajudar com aluguel de carros e motos, preços, documentos e cadastro. O que você precisa?",
    suggestions: ["Quero alugar", "Preços", "Modelos disponíveis", "Como funciona"],
  },
  {
    id: "precos",
    keywords: [
      "preco",
      "precos",
      "valor",
      "valores",
      "quanto custa",
      "quanto fica",
      "quanto e",
      "tabela",
      "diaria",
      "custa",
      "orcamento",
    ],
    answer: `Nossos preços 👇\n\n**Carros** — planos semanais para motoristas de app (franquia de km):\n${precosCarros}\n\n**Moto CG 160 Start:** ${brl(
      MOTO_PRECOS.diaria
    )}/dia • ${brl(MOTO_PRECOS.semanal)}/sem • ${brl(MOTO_PRECOS.mensal)}/mês\n\nCaução: carros ${brl(
      GRUPOS.C.caucao
    )} • moto ${brl(
      MOTO_PRECOS.caucao
    )} (parcelável em até 12x). Quer que eu inicie seu cadastro para a cotação certinha?`,
    suggestions: ["Quero alugar", "Plano Fidelidade", "Falar no WhatsApp"],
  },
  {
    id: "modelos",
    keywords: [
      "modelo",
      "modelos",
      "frota",
      "quais carros",
      "carros disponiveis",
      "disponivel",
      "disponiveis",
      "mobi",
      "kwid",
      "polo",
      "onix",
      "argo",
      "hb20",
      "hb20s",
      "cronos",
      "onix plus",
      "cg",
      "cg160",
      "cg 160",
    ],
    answer: `Esses são os veículos da nossa frota: 🚗🏍️\n\n${frotaLista}\n\nTodos revisados e prontos para rodar. Quer fazer o cadastro para algum deles?`,
    suggestions: ["Quero alugar", "Preços", "Falar no WhatsApp"],
  },
  {
    id: "documentos",
    keywords: [
      "documento",
      "documentos",
      "preciso de",
      "requisito",
      "requisitos",
      "cnh",
      "habilitacao",
      "carteira",
      "exige",
      "exigencia",
    ],
    answer:
      "Para alugar é necessário preencher o **cadastro** e apresentar a **CNH válida**.\n\nPara **motoristas de aplicativo**:\n• Mais de 25 anos\n• CNH há pelo menos 2 anos, com **EAR** (atividade remunerada)\n• Garagem apropriada\n• Não possuir débitos em outras locadoras\n\nA caução pode ser parcelada em até 12x no cartão. 😉",
    suggestions: ["Quero alugar", "Motorista de app", "Formas de pagamento"],
  },
  {
    id: "idade",
    keywords: ["idade", "anos", "idade minima", "menor", "21", "25", "tenho 18"],
    answer:
      "Para locação de motoristas de aplicativo é preciso ter **mais de 25 anos** e CNH há pelo menos 2 anos com **EAR**. Para outras locações, consulte nossa equipe — as condições variam por plano.",
    suggestions: ["Documentos", "Quero alugar", "Falar no WhatsApp"],
  },
  {
    id: "fidelidade",
    keywords: [
      "fidelidade",
      "plano fidelidade",
      "transferido",
      "transferencia",
      "ficar com o carro",
      "carro meu",
      "moto minha",
      "ser meu",
      "ser minha",
      "quitar",
      "financiamento",
    ],
    answer: `No **plano Fidelidade** você aluga e, ao final do contrato, **o veículo é transferido para você** — paga pelo que será seu! 🎉\n\n🚗 **Carro** (ex.: ${
      FIDELIDADE.carro.modelo
    }, ${FIDELIDADE.carro.meses} meses): ${brl(
      FIDELIDADE.carro.diaria
    )}/dia • caução ${brl(FIDELIDADE.carro.caucao)}\n\n🏍️ **Moto CG 160 Start:**\n${FIDELIDADE.moto
      .map((m) => `• ${m.plano}: ${brl(m.semanal)}/sem`)
      .join("\n")}\nCaução ${brl(
      FIDELIDADE.motoCaucao
    )} em até 12x.\n\nQuer fazer o cadastro para o plano Fidelidade?`,
    suggestions: ["Quero alugar", "Modelos disponíveis", "Falar no WhatsApp"],
  },
  {
    id: "como_funciona",
    keywords: [
      "como funciona",
      "como faco",
      "como alugar",
      "passo a passo",
      "como pego",
      "como e",
      "funciona",
    ],
    answer:
      "É bem simples, em 3 passos: 🚗\n\n**1.** Escolha o veículo (carro ou moto)\n**2.** Faça o cadastro aqui comigo — eu envio seus dados para a equipe e te levo para o WhatsApp\n**3.** Confirmada a disponibilidade, retire o veículo na nossa loja, sem agendamento\n\nQuer começar agora?",
    suggestions: ["Quero alugar", "Documentos", "Onde fica a loja"],
  },
  {
    id: "app",
    keywords: [
      "aplicativo",
      "app",
      "uber",
      "99",
      "motorista",
      "trabalhar",
      "rodar",
      "entregador",
      "ifood",
    ],
    answer: `Temos planos especiais para **motoristas de aplicativo** (Uber, 99 e entregadores)! 🚀\n\nPlanos **semanais** com franquia de km:\n${precosCarros}\n\n🏍️ CG 160 Start para entregas: ${brl(
      MOTO_PRECOS.semanal
    )}/sem.\n\n• Período mínimo de **4 semanas**\n• Carros aceitos nas principais categorias de app\n• Caução de ${brl(
      GRUPOS.C.caucao
    )} parcelável em até 12x\n• Manutenção e oficina própria por nossa conta\n\nRequisitos: mais de 25 anos e CNH há 2+ anos com EAR. Quer fazer seu cadastro?`,
    suggestions: ["Quero alugar", "Preços", "Falar no WhatsApp"],
  },
  {
    id: "seguro",
    keywords: ["seguro", "cobertura", "protecao", "bati", "acidente", "sinistro"],
    answer:
      "Sim! Todos os nossos planos já vêm com **cobertura/seguro incluso** para você rodar tranquilo. Também é possível contratar proteções adicionais para ainda mais segurança.",
    suggestions: ["Documentos", "Quero alugar"],
  },
  {
    id: "agendamento",
    keywords: [
      "agendar",
      "agendamento",
      "marcar",
      "marcar horario",
      "hora marcada",
      "agenda",
      "que dia",
      "reservar data",
    ],
    answer:
      "A MCM **não trabalha com agendamento de retirada**. 😉 Funciona assim: você faz o cadastro aqui comigo ou pelo WhatsApp, nossa equipe confirma a disponibilidade do veículo e você retira direto na loja, no Distrito Industrial. Rápido e sem hora marcada.",
    suggestions: ["Quero alugar", "Onde fica a loja", "Falar no WhatsApp"],
  },
  {
    id: "entrega",
    keywords: ["entrega", "entregar", "leva", "levam", "buscar", "domicilio", "no local", "aeroporto", "retirada", "retirar", "onde pego", "onde retiro"],
    answer:
      "A **retirada e a devolução** são sempre na nossa loja, no Distrito Industrial, em Manaus/AM. 📍 Não trabalhamos com entrega no endereço nem com agendamento — confirmou a disponibilidade, é só vir retirar.",
    suggestions: ["Quero alugar", "Onde fica a loja", "Falar no WhatsApp"],
  },
  {
    id: "planos",
    keywords: ["plano", "planos", "assinatura", "mensal", "mensalidade", "anual", "longo prazo", "assinar"],
    answer: `Temos formatos para cada necessidade:\n\n${PLANS.map(
      (p) =>
        `• **${p.name}** — ${
          p.pricePrefix ? `${p.pricePrefix} ` : ""
        }${p.priceLabel}${p.unit}`
    ).join(
      "\n"
    )}\n\nNo **Fidelidade**, o veículo é transferido para você ao final do contrato. Quer que eu te ajude a escolher?`,
    suggestions: ["Quero alugar", "Preços", "Plano Fidelidade"],
  },
  {
    id: "motos",
    keywords: ["moto", "motos", "motocicleta", "duas rodas", "cg", "honda"],
    answer: `Sim, alugamos moto também! 🏍️ A **Honda CG 160 Start**, ideal para o dia a dia e entregas:\n\n• **Diária:** ${brl(
      MOTO_PRECOS.diaria
    )}/dia (km livre, até 6 diárias)\n• **Semanal:** ${brl(
      MOTO_PRECOS.semanal
    )}/sem (franquia 1.000 km)\n• **Mensal:** ${brl(
      MOTO_PRECOS.mensal
    )}/mês (franquia 4.000 km)\n\nCaução ${brl(
      MOTO_PRECOS.caucao
    )}. Também tem no plano **Fidelidade** (a moto fica sua!). Quer fazer o cadastro?`,
    suggestions: ["Quero alugar", "Plano Fidelidade", "Motorista de app"],
  },
  {
    id: "pagamento",
    keywords: ["pagamento", "pagar", "cartao", "pix", "forma de pagamento", "parcela", "credito", "debito", "caucao", "boleto", "deposito"],
    answer:
      "Formas de pagamento: 💳\n\n• **PIX**, cartão de **débito**, **crédito** ou transferência\n• A **caução** pode ser parcelada em até **12x no cartão de crédito** (com juros)\n• Renovações semanais são pagas por **boleto**\n• A caução é devolvida em **15 dias** após o encerramento do contrato, descontados eventuais débitos",
    suggestions: ["Quero alugar", "Documentos", "Falar no WhatsApp"],
  },
  {
    id: "quilometragem",
    keywords: ["quilometragem", "km", "limite", "rodar quanto", "kilometragem", "franquia", "km livre"],
    answer:
      "Os planos para motoristas de app têm **franquias de 1250, 1500 ou 1750 km por semana** (não é km livre). 🛣️\n\nA apuração é feita a cada 4 semanas e o excedente, quando houver, é cobrado por fatura/boleto. Para outros planos, consulte a equipe.",
    suggestions: ["Falar no WhatsApp", "Planos e assinatura", "Quero alugar"],
  },
  {
    id: "cancelamento",
    keywords: ["cancelar", "cancelamento", "desistir", "estorno", "multa"],
    answer:
      "As diárias são **sem fidelidade**. Para cancelamentos de reservas ou planos, nossa equipe te orienta certinho — quer que eu te conecte no WhatsApp?",
    suggestions: ["Falar no WhatsApp", "Quero alugar"],
  },
  {
    id: "horario",
    keywords: ["horario", "hora", "funcionamento", "aberto", "atendimento", "que horas"],
    answer: `Nosso atendimento: ⏰\n\n${COMPANY.hours}\n\nQuer fazer seu cadastro? Posso adiantar agora mesmo.`,
    suggestions: ["Quero alugar", "Endereço da loja", "Falar no WhatsApp"],
  },
  {
    id: "endereco",
    keywords: ["endereco", "onde fica", "localizacao", "loja", "mapa", "como chego", "fica onde"],
    answer: `Estamos em: 📍\n\n${COMPANY.address}\n\nA retirada e a devolução são sempre aqui na loja.\n\n${COMPANY.hours}`,
    suggestions: ["Como funciona", "Quero alugar", "Falar no WhatsApp"],
  },
  {
    id: "contato",
    keywords: ["contato", "telefone", "whatsapp", "falar", "atendente", "humano", "ligar", "numero"],
    answer: `Claro! Você pode falar direto com a nossa equipe:\n\n📱 WhatsApp/Telefone: **${COMPANY.phone}**\n✉️ E-mail: ${COMPANY.email}\n\nÉ só tocar no botão abaixo.`,
    suggestions: ["Falar no WhatsApp", "Quero alugar"],
  },
  {
    id: "agradecimento",
    keywords: ["obrigado", "obrigada", "valeu", "vlw", "agradecido", "show", "perfeito", "otimo"],
    answer:
      "Por nada! 😊 Estou por aqui se precisar de mais alguma coisa. Boa estrada com a MCM Rent a Car! 🚗💨",
    suggestions: ["Quero alugar", "Preços", "Falar no WhatsApp"],
  },
];

/** Pontua um intent contra a pergunta normalizada do usuário. */
function scoreIntent(query: string, intent: Intent): number {
  const q = ` ${norm(query)} `;
  const tokens = q.trim().split(/\s+/);
  let score = 0;
  for (const kw of intent.keywords) {
    const k = norm(kw);
    if (k.includes(" ")) {
      if (q.includes(` ${k} `) || q.includes(k)) score += 3;
    } else if (tokens.includes(k)) {
      score += 2;
    } else if (k.length >= 5 && tokens.some((t) => t.startsWith(k))) {
      score += 1;
    }
  }
  return score;
}

/** Retorna o melhor intent para a pergunta, ou null se nada relevante. */
export function matchIntent(query: string): Intent | null {
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(query, intent);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }
  return bestScore > 0 ? best : null;
}

/** Detecta se a mensagem é um pedido para iniciar o cadastro. */
export function isCadastroTrigger(query: string): boolean {
  const q = norm(query);
  return CADASTRO_TRIGGERS.some((t) => q.includes(norm(t)));
}

export const FALLBACK_ANSWER =
  "Hmm, não tenho certeza se entendi. 🤔 Posso te ajudar com **preços**, **modelos**, **documentos**, **como alugar** ou iniciar seu **cadastro**. Se preferir, te conecto com a equipe no WhatsApp.";

export const WELCOME =
  "Olá! 👋 Eu sou o assistente virtual da **MCM Rent a Car**.\n\nPosso tirar dúvidas sobre nossos carros e motos ou fazer o seu **cadastro** para alugar. Como posso ajudar?";

export const INITIAL_SUGGESTIONS = [
  "Quero alugar",
  "Modelos disponíveis",
  "Preços",
  "Como funciona",
];

// ---------------------------------------------------------------------------
// Abertura do chat a partir de outras partes do site (cards da frota, hero...)
// ---------------------------------------------------------------------------

export const CHAT_OPEN_EVENT = "mcm:chat";

export type ChatOpenDetail = {
  /** Nome curto do veículo escolhido (ex.: "Onix"). Pula as perguntas de categoria/modelo. */
  veiculo?: string;
  /** Categoria escolhida (ex.: "Sedans"). Pula a pergunta de categoria. */
  categoria?: string;
  /** Plano escolhido (ex.: "Fidelidade"). Pula a pergunta de plano. */
  plano?: string;
};

/** Abre o chatbot já no fluxo de cadastro, com veículo/categoria pré-selecionados. */
export function abrirChat(detail: ChatOpenDetail = {}): void {
  window.dispatchEvent(new CustomEvent<ChatOpenDetail>(CHAT_OPEN_EVENT, { detail }));
}

// Modal com a tabela de preços/franquias de um grupo (ou de todos).
export const PLANOS_OPEN_EVENT = "mcm:planos";

/** Grupo (C/D/DS/Moto) a exibir; ausente = mostra todos. */
export type PlanosOpenDetail = { grupo?: Grupo };

/** Abre o modal de detalhes de planos e franquias. */
export function abrirPlanos(detail: PlanosOpenDetail = {}): void {
  window.dispatchEvent(new CustomEvent<PlanosOpenDetail>(PLANOS_OPEN_EVENT, { detail }));
}

/** Categoria de cadastro correspondente a um grupo de preço. */
export const GRUPO_CATEGORIA: Record<Grupo, string> = {
  C: "Compactos",
  D: "Hatchs",
  DS: "Sedans",
  Moto: "Motos",
};

// ---------------------------------------------------------------------------
// Fluxo de cadastro do cliente
// ---------------------------------------------------------------------------

export type CadastroData = Record<string, string>;

export type CadastroStep = {
  key: string;
  label: string;
  /** Pergunta fixa ou dependente das respostas anteriores. */
  question: string | ((data: CadastroData) => string);
  type: "text" | "tel" | "email" | "options";
  options?: string[] | ((data: CadastroData) => string[]);
  inputMode?: "text" | "tel" | "email" | "numeric";
  /** Normaliza o valor antes de salvar (ex.: formatar CPF / data). */
  transform?: (v: string, data: CadastroData) => string;
  /** Se retornar true, o passo é pulado (ex.: período já implícito pelo plano). */
  skip?: (data: CadastroData) => boolean;
  validate?: (v: string, data: CadastroData) => string | null;
  /**
   * Hook assíncrono após a validação (ex.: buscar CEP na API). Pode devolver
   * um erro (re-pergunta) ou um patch de dados a mesclar no cadastro.
   */
  resolve?: (
    valor: string,
    data: CadastroData
  ) => Promise<{ patch?: CadastroData; erro?: string }>;
};

const soDigitos = (v: string) => v.replace(/\D/g, "");

/** Formata CPF: 12345678901 -> 123.456.789-01. */
const fmtCPF = (v: string) =>
  soDigitos(v).slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

/** Formata data: 25121990 -> 25/12/1990. */
const fmtData = (v: string) =>
  soDigitos(v).slice(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");

/** Formata CEP: 69000000 -> 69000-000. */
const fmtCEP = (v: string) => soDigitos(v).slice(0, 8).replace(/(\d{5})(\d{3})/, "$1-$2");

/** true quando a resposta significa "não" (para campos opcionais). */
const respostaNao = (v?: string) => !v || norm(v) === "nao" || norm(v) === "nao.";

/** Busca o CEP na ViaCEP. Erro de CEP inexistente re-pergunta; falha de rede cai no manual. */
async function buscaCEP(valor: string): Promise<{ patch?: CadastroData; erro?: string }> {
  const cep = soDigitos(valor);
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!r.ok) throw new Error("http");
    const j = (await r.json()) as {
      erro?: boolean;
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    };
    if (j.erro) return { erro: "Não encontrei esse CEP 🤔. Pode conferir os números?" };
    return {
      patch: {
        logradouro: j.logradouro ?? "",
        bairro: j.bairro ?? "",
        cidade: j.localidade ?? "",
        uf: j.uf ?? "",
      },
    };
  } catch {
    // API fora do ar → segue para o endereço digitado manualmente.
    return { patch: { cepFalhou: "1" } };
  }
}

/** Endereço detectado pelo CEP, para a mensagem de confirmação. */
function enderecoBase(d: CadastroData): string {
  const cidadeUf = [d.cidade, d.uf].filter(Boolean).join("/");
  return [d.logradouro, d.bairro, cidadeUf].filter(Boolean).join(", ") || "(endereço não detalhado)";
}

/** Endereço final montado (CEP + número + complemento, ou o digitado manualmente). */
export function enderecoFinal(d: CadastroData): string {
  if (d.enderecoManual) return d.enderecoManual;
  const ruaNum = [d.logradouro, d.numero].filter(Boolean).join(", ");
  const compl = respostaNao(d.complemento) ? "" : d.complemento;
  const cidadeUf = [d.cidade, d.uf].filter(Boolean).join("/");
  return [ruaNum, compl, d.bairro, cidadeUf].filter(Boolean).join(", ");
}

/** Valida CPF com dígitos verificadores. */
function validaCPF(v: string): string | null {
  const c = soDigitos(v);
  if (c.length !== 11) return "O CPF deve ter 11 dígitos. 🪪";
  if (/^(\d)\1{10}$/.test(c)) return "Esse CPF não parece válido. Pode conferir?";
  const dig = (base: string, pesoIni: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoIni - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  if (dig(c.slice(0, 9), 10) !== Number(c[9]) || dig(c.slice(0, 10), 11) !== Number(c[10]))
    return "Esse CPF não parece válido. Pode conferir?";
  return null;
}

/** Valida data de nascimento (dd/mm/aaaa) e idade mínima de 18 anos. */
function validaNascimento(v: string): string | null {
  const d = soDigitos(v);
  if (d.length !== 8) return "Digite no formato dd/mm/aaaa (ex: 25/12/1990). 📅";
  const dia = Number(d.slice(0, 2));
  const mes = Number(d.slice(2, 4));
  const ano = Number(d.slice(4, 8));
  const dt = new Date(ano, mes - 1, dia);
  if (dt.getFullYear() !== ano || dt.getMonth() !== mes - 1 || dt.getDate() !== dia)
    return "Essa data não parece válida. Pode conferir?";
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  if (hoje.getMonth() < mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)) idade--;
  if (idade < 18) return "É necessário ter no mínimo 18 anos para o cadastro.";
  if (idade > 100) return "Confere o ano de nascimento? 🙂";
  return null;
}

export const CADASTRO_STEPS: CadastroStep[] = [
  {
    key: "nome",
    label: "Nome",
    question: "Para começar, qual é o seu **nome completo**?",
    type: "text",
    validate: (v) => (v.trim().length < 3 ? "Por favor, digite seu nome completo." : null),
  },
  {
    key: "cpf",
    label: "CPF",
    question: "Qual o seu **CPF**? (só números)",
    type: "text",
    inputMode: "numeric",
    transform: fmtCPF,
    validate: validaCPF,
  },
  {
    key: "nascimento",
    label: "Data de nascimento",
    question: "Qual a sua **data de nascimento**? (dd/mm/aaaa)",
    type: "text",
    inputMode: "numeric",
    transform: fmtData,
    validate: validaNascimento,
  },
  {
    key: "estadoCivil",
    label: "Estado civil",
    question: "Qual o seu **estado civil**?",
    type: "options",
    options: ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"],
  },
  {
    key: "telefone",
    label: "WhatsApp",
    question: "Qual o seu **WhatsApp** com DDD? (ex: (92) 98888-7777)",
    type: "tel",
    inputMode: "tel",
    validate: (v) => {
      const d = v.replace(/\D/g, "");
      return d.length < 10 || d.length > 11 ? "Digite um telefone válido com DDD. 📱" : null;
    },
  },
  {
    key: "email",
    label: "E-mail",
    question: "Qual o seu melhor **e-mail**?",
    type: "email",
    inputMode: "email",
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? null
        : "Esse e-mail não parece válido. Pode conferir? ✉️",
  },
  {
    key: "cep",
    label: "CEP",
    question: "Qual o **CEP** do seu endereço? (só números) 📮",
    type: "text",
    inputMode: "numeric",
    transform: fmtCEP,
    validate: (v) => (soDigitos(v).length !== 8 ? "O CEP deve ter 8 dígitos." : null),
    resolve: (v) => buscaCEP(v),
  },
  {
    key: "cepConfirma",
    label: "Confirmar endereço",
    // Só aparece quando o CEP foi encontrado.
    skip: (d) => d.cepFalhou === "1",
    question: (d) =>
      `Encontrei este endereço pelo CEP:\n\n📍 **${enderecoBase(d)}**\n\nÉ esse mesmo?`,
    type: "options",
    options: ["Sim, é esse", "Não, digitar outro"],
  },
  {
    key: "numero",
    label: "Número",
    // Só quando o CEP foi confirmado.
    skip: (d) => d.cepFalhou === "1" || (d.cepConfirma ?? "").startsWith("Não"),
    question: "Qual o **número**? (se não tiver, digite S/N)",
    type: "text",
    validate: (v) => (v.trim().length < 1 ? "Me diga o número, por favor." : null),
  },
  {
    key: "complemento",
    label: "Complemento",
    skip: (d) => d.cepFalhou === "1" || (d.cepConfirma ?? "").startsWith("Não"),
    question:
      "Algum **complemento**? (apto, bloco, ponto de referência) Se não tiver, digite *não*.",
    type: "text",
  },
  {
    key: "enderecoManual",
    label: "Endereço",
    // Aparece quando o CEP falhou ou o cliente disse que não é o endereço.
    skip: (d) => d.cepFalhou !== "1" && (d.cepConfirma ?? "").startsWith("Sim"),
    question: "Sem problema! Digite seu **endereço completo** (rua, número, bairro e cidade).",
    type: "text",
    validate: (v) =>
      v.trim().length < 8 ? "Digite o endereço completo (rua, número, bairro e cidade)." : null,
  },
  {
    key: "cnh",
    label: "Possui CNH",
    question: "Você possui **CNH válida**?",
    type: "options",
    options: ["Sim", "Não"],
  },
  {
    key: "categoria",
    label: "Categoria",
    question: "Qual **categoria** de veículo você quer alugar?",
    type: "options",
    options: CATEGORIES,
  },
  {
    key: "veiculo",
    label: "Veículo",
    question: "Qual **modelo** você prefere?",
    type: "options",
    options: (data) =>
      data.categoria && CATEGORIES.includes(data.categoria)
        ? modelosDa(data.categoria)
        : FLEET.map((v) => v.short),
  },
  {
    key: "plano",
    label: "Plano",
    question:
      "Qual **plano** te interessa?\n\n• **Diária** — necessidades pontuais\n• **Semanal** — motoristas de app (franquias de km)\n• **Mensal** — uso no dia a dia\n• **Fidelidade** — o veículo é transferido para você ao final do contrato",
    type: "options",
    options: PLANS.map((p) => p.name),
  },
  {
    key: "periodo",
    label: "Período",
    // Plano Mensal/Fidelidade já define o período — não pergunta de novo.
    skip: (d) => d.plano === "Mensal" || d.plano === "Fidelidade",
    question: (d) => {
      if (d.plano === "Diária") return "Quantas **diárias** você pretende? (ex: 3)";
      if ((d.plano ?? "").startsWith("Semanal"))
        return "Por **quantas semanas** pretende alugar? (mínimo de 4 semanas — ex: 4)";
      return "Por quanto **tempo** pretende alugar? (ex: 3 diárias, 1 semana)";
    },
    type: "text",
    validate: (v, d) => {
      if (v.trim().length < 1) return "Me diga o período, por favor.";
      // Plano Semanal — App exige período mínimo de 4 semanas.
      if ((d.plano ?? "").startsWith("Semanal")) {
        const n = parseInt(soDigitos(v), 10);
        if (isNaN(n) || n < 4)
          return "Para o plano **Semanal — App**, o período mínimo é de **4 semanas**. 😉 Por quantas semanas quer alugar?";
      }
      return null;
    },
    // Se digitar só o número, guarda bonitinho ("4" -> "4 semanas" / "3 diárias").
    transform: (v, d) => {
      const t = v.trim();
      if (/^\d+$/.test(t)) {
        if ((d.plano ?? "").startsWith("Semanal")) return `${Number(t)} semanas`;
        if (d.plano === "Diária") return `${Number(t)} diárias`;
      }
      return t;
    },
  },
  {
    key: "obs",
    label: "Observação",
    question:
      "Quer adicionar alguma **observação**? (dúvidas, uso para aplicativo, etc.) Se não, é só digitar *não*.",
    type: "text",
  },
];

/** Resolve as opções de um passo (fixas ou dependentes das respostas anteriores). */
export function stepOptions(step: CadastroStep, data: CadastroData): string[] | undefined {
  if (!step.options) return undefined;
  return typeof step.options === "function" ? step.options(data) : step.options;
}

/** Resolve o texto da pergunta de um passo (fixo ou dependente das respostas). */
export function stepQuestion(step: CadastroStep, data: CadastroData): string {
  return typeof step.question === "function" ? step.question(data) : step.question;
}

/** Índice do primeiro passo ainda sem resposta (pulando os que devem ser ignorados). */
export function proximoPasso(data: CadastroData, from = 0): number {
  for (let i = from; i < CADASTRO_STEPS.length; i++) {
    const s = CADASTRO_STEPS[i];
    if (s.skip?.(data)) continue;
    if (data[s.key] === undefined) return i;
  }
  return -1;
}

const semObs = (obs?: string) => !obs || norm(obs) === "nao" || norm(obs) === "nao.";

/** Monta a mensagem de WhatsApp com os dados do cadastro. */
export function cadastroToWhats(d: CadastroData): string {
  const linhas = [
    "Olá! Quero fazer um cadastro/reserva na MCM Rent a Car. 🚗",
    "",
    `*Nome:* ${d.nome}`,
    `*CPF:* ${d.cpf}`,
    `*Nascimento:* ${d.nascimento}`,
    `*Estado civil:* ${d.estadoCivil}`,
    `*WhatsApp:* ${d.telefone}`,
    `*E-mail:* ${d.email}`,
    `*CEP:* ${d.cep ?? "—"}`,
    `*Endereço:* ${enderecoFinal(d)}`,
    `*Possui CNH:* ${d.cnh}`,
    `*Categoria:* ${d.categoria}`,
    `*Veículo:* ${d.veiculo}`,
    `*Plano:* ${d.plano}`,
  ];
  if (d.periodo) linhas.push(`*Período:* ${d.periodo}`);
  if (!semObs(d.obs)) {
    linhas.push(`*Observação:* ${d.obs}`);
  }
  return linhas.join("\n");
}

/** Monta o payload enviado automaticamente para o e-mail da loja. */
export function cadastroToEmail(d: CadastroData): Record<string, string> {
  return {
    Nome: d.nome ?? "",
    CPF: d.cpf ?? "",
    "Data de nascimento": d.nascimento ?? "",
    "Estado civil": d.estadoCivil ?? "",
    WhatsApp: d.telefone ?? "",
    "E-mail": d.email ?? "",
    CEP: d.cep ?? "—",
    Endereço: enderecoFinal(d),
    "Possui CNH": d.cnh ?? "",
    Categoria: d.categoria ?? "",
    Veículo: d.veiculo ?? "",
    Plano: d.plano ?? "",
    Período: d.periodo ?? "—",
    Observação: semObs(d.obs) ? "—" : d.obs!,
  };
}

export function whatsLink(text: string): string {
  return `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(text)}`;
}

/** Resumo amigável exibido no chat antes de enviar. */
export function cadastroResumo(d: CadastroData): string {
  const primeiroNome = d.nome.trim().split(/\s+/)[0];
  const linhas = [
    `Prontinho, ${primeiroNome}! ✅ Confira seus dados:`,
    "",
    `• **Nome:** ${d.nome}`,
    `• **CPF:** ${d.cpf}`,
    `• **Nascimento:** ${d.nascimento}`,
    `• **Estado civil:** ${d.estadoCivil}`,
    `• **WhatsApp:** ${d.telefone}`,
    `• **E-mail:** ${d.email}`,
    `• **Endereço:** ${enderecoFinal(d)}`,
    `• **Possui CNH:** ${d.cnh}`,
    `• **Categoria:** ${d.categoria}`,
    `• **Veículo:** ${d.veiculo}`,
    `• **Plano:** ${d.plano}`,
  ];
  if (d.periodo) linhas.push(`• **Período:** ${d.periodo}`);
  if (!semObs(d.obs)) {
    linhas.push(`• **Observação:** ${d.obs}`);
  }
  linhas.push(
    "",
    'Toque em **"Continuar no WhatsApp"** que nossa equipe finaliza sua reserva. 🚀'
  );
  return linhas.join("\n");
}

/** Salva uma cópia do cadastro no navegador (localStorage). */
export function salvarCadastro(d: CadastroData): void {
  try {
    const raw = localStorage.getItem("mcm_cadastros");
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ ...d, criadoEm: new Date().toISOString() });
    localStorage.setItem("mcm_cadastros", JSON.stringify(arr));
  } catch {
    /* ignora falha de storage (modo privado, etc.) */
  }
}

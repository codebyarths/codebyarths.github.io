// Conteúdo central do site MCM Rent a Car.
// Dados de contato reais reaproveitados do site original.

export const COMPANY = {
  name: "MCM Rent a Car",
  short: "MCM",
  tagline: "Locação ágil de carros e motos",
  city: "Manaus / AM",
  phone: "(92) 98816-0415",
  phoneRaw: "5592988160415",
  email: "contato@mcmrentacar.com.br",
  address: "Av. Rodrigo Otávio, 2890 - Sala 11, Distrito Industrial, Manaus/AM",
  cnpj: "03.360.950/0001-15",
  hours: "Seg a Sex: 8h às 18h • Sáb: 8h às 12h • Suporte 24h",
};

export const WHATSAPP = `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(
  "Olá! Gostaria de fazer uma reserva na MCM Rent a Car."
)}`;

export const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Frota", href: "#frota" },
  { label: "Planos", href: "#planos" },
  { label: "Motoristas de App", href: "#app" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

export type Grupo = "C" | "D" | "DS" | "Moto";

export type Vehicle = {
  category: string;
  /** Nome completo exibido no card (ex.: "Fiat Mobi"). */
  name: string;
  /** Nome curto para listas do chat (ex.: "Mobi"). */
  short: string;
  image: string;
  /** Grupo de preço (define a tabela semanal — ver GRUPOS). */
  group: Grupo;
  seats: number;
  transmission: string;
  fuel: string;
  badge?: string;
  highlight?: boolean;
};

// Frota real da loja. Fotos ilustrativas por modelo.
export const FLEET: Vehicle[] = [
  // Compactos — Grupo C
  { category: "Compactos", name: "Fiat Mobi", short: "Mobi", image: "/brand/vehicles/mobi.jpg", group: "C", seats: 5, transmission: "Manual", fuel: "Flex", badge: "Mais econômico" },
  { category: "Compactos", name: "Renault Kwid", short: "Kwid", image: "/brand/vehicles/kwid.png", group: "C", seats: 5, transmission: "Manual", fuel: "Flex" },
  // Hatchs — Grupo D
  { category: "Hatchs", name: "Fiat Argo", short: "Argo", image: "/brand/vehicles/argo.jpg", group: "D", seats: 5, transmission: "Manual", fuel: "Flex" },
  { category: "Hatchs", name: "Hyundai HB20", short: "HB20", image: "/brand/vehicles/hb20.png", group: "D", seats: 5, transmission: "Manual", fuel: "Flex" },
  { category: "Hatchs", name: "Chevrolet Onix", short: "Onix", image: "/brand/vehicles/onix.jpg", group: "D", seats: 5, transmission: "Manual", fuel: "Flex", badge: "Mais alugado", highlight: true },
  { category: "Hatchs", name: "VW Polo", short: "Polo", image: "/brand/vehicles/polo.jpg", group: "D", seats: 5, transmission: "Manual", fuel: "Flex", badge: "Conforto" },
  // Sedans — Grupo DS
  { category: "Sedans", name: "Hyundai HB20S", short: "HB20S", image: "/brand/vehicles/hb20s.png", group: "DS", seats: 5, transmission: "Automático", fuel: "Flex" },
  { category: "Sedans", name: "Chevrolet Onix Plus", short: "Onix Plus", image: "/brand/vehicles/onix-plus.jpg", group: "DS", seats: 5, transmission: "Automático", fuel: "Flex" },
  { category: "Sedans", name: "Fiat Cronos", short: "Cronos", image: "/brand/vehicles/cronos.jpg", group: "DS", seats: 5, transmission: "Automático", fuel: "Flex", badge: "Porta-malas grande" },
  // Moto
  { category: "Motos", name: "Honda CG 160 Start", short: "CG 160 Start", image: "/brand/vehicles/cg160.jpg", group: "Moto", seats: 2, transmission: "Manual", fuel: "Gasolina", badge: "Para trabalhar" },
];

export const CATEGORIES = Array.from(new Set(FLEET.map((v) => v.category)));

/** Modelos (nomes curtos) de uma categoria. */
export function modelosDa(categoria: string): string[] {
  return FLEET.filter((v) => v.category === categoria).map((v) => v.short);
}

/** Formata em reais no padrão pt-BR: 599.9 -> "R$ 599,90". */
export function brl(n: number): string {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Formata um inteiro no padrão pt-BR: 1250 -> "1.250". */
export function num(n: number): string {
  return n.toLocaleString("pt-BR");
}

export type Franquia = { km: number; semana: number };

// Preços reais (fonte: mcmveiculos.com.br). Carros são alugados em planos
// SEMANAIS para motoristas de app, por franquia de km. Caução dos carros: R$ 1.600.
export const GRUPOS: Record<
  Grupo,
  { nome: string; exemplos: string; franquias: Franquia[]; caucao: number }
> = {
  C: {
    nome: "Compactos",
    exemplos: "Mobi, Kwid",
    franquias: [
      { km: 1250, semana: 599.9 },
      { km: 1500, semana: 700.7 },
      { km: 1750, semana: 801.5 },
    ],
    caucao: 1600,
  },
  D: {
    nome: "Hatch",
    exemplos: "Argo, Onix, Polo, HB20",
    franquias: [
      { km: 1250, semana: 649.95 },
      { km: 1500, semana: 750.05 },
      { km: 1750, semana: 850.5 },
    ],
    caucao: 1600,
  },
  DS: {
    nome: "Sedan",
    exemplos: "Onix Plus, HB20S, Cronos",
    franquias: [
      { km: 1250, semana: 750.05 },
      { km: 1500, semana: 871.5 },
      { km: 1750, semana: 990.15 },
    ],
    caucao: 1600,
  },
  Moto: {
    nome: "Moto",
    exemplos: "CG 160 Start",
    franquias: [{ km: 1000, semana: 280 }],
    caucao: 500,
  },
};

// Moto CG 160 Start — planos avulsos (diária/semanal/mensal).
export const MOTO_PRECOS = {
  diaria: 55, // km livre, máximo 6 diárias
  semanal: 280, // franquia 1.000 km
  mensal: 1100, // franquia 4.000 km
  caucao: 500,
};

// Plano Fidelidade — o veículo é transferido ao locatário ao final do contrato.
export const FIDELIDADE = {
  carro: { modelo: "VW Polo Track", meses: 48, diaria: 135, caucao: 7000 },
  moto: [
    { plano: "3 anos", semanal: 335 },
    { plano: "2,5 anos", semanal: 390, popular: true },
    { plano: "2 anos", semanal: 470 },
  ],
  motoCaucao: 1000, // parcelável em até 12x no cartão
};

/** Menor valor semanal do grupo do veículo. */
export function semanaFrom(v: Vehicle): number {
  return GRUPOS[v.group].franquias[0].semana;
}

/** Rótulo de preço "a partir de" para o card da frota. */
export function precoCard(v: Vehicle): { value: string; unit: string; note: string } {
  if (v.group === "Moto") {
    return { value: brl(MOTO_PRECOS.diaria), unit: "/dia", note: "km livre" };
  }
  const f = GRUPOS[v.group].franquias[0];
  return { value: brl(f.semana), unit: "/sem", note: `franquia ${num(f.km)} km` };
}

export type Plan = {
  name: string;
  description: string;
  priceLabel: string;
  /** Prefixo pequeno antes do valor (ex.: "a partir de"). */
  pricePrefix?: string;
  unit: string;
  features: string[];
  highlight?: boolean;
  /** Selo exibido no topo do card quando em destaque. */
  tag?: string;
  /** Exibir na seção "Planos" da home. Diária/Mensal (só moto) ficam de fora. */
  naSecao?: boolean;
  cta: string;
};

export const PLANS: Plan[] = [
  {
    name: "Semanal — App",
    description: "Para motoristas de aplicativo rodarem sem preocupação.",
    priceLabel: brl(GRUPOS.C.franquias[0].semana),
    pricePrefix: "a partir de",
    unit: "/sem",
    features: [
      "Franquias de 1.250, 1.500 ou 1.750 km/semana",
      "Compactos, hatchs e sedans aceitos nas categorias de app",
      "Caução de R$ 1.600 parcelável em até 12x",
      "Renovação semanal por boleto",
    ],
    naSecao: true,
    cta: "Quero rodar de app",
  },
  {
    name: "Diária",
    description: "Moto CG 160 Start para necessidades pontuais.",
    priceLabel: brl(MOTO_PRECOS.diaria),
    unit: "/dia",
    features: [
      "Quilometragem livre — rode o quanto precisar",
      "Máximo de 6 diárias por contrato",
      "Retirada no mesmo dia, sem agendamento",
      "Caução de R$ 500",
    ],
    cta: "Alugar por diária",
  },
  {
    name: "Mensal",
    description: "Moto CG 160 Start no melhor custo-benefício.",
    priceLabel: brl(MOTO_PRECOS.mensal),
    unit: "/mês",
    features: [
      "Super franquia de 4.000 km/mês",
      "Manutenção preventiva por nossa conta",
      "Assistência e reboque 24h",
      "Caução de R$ 500",
    ],
    cta: "Assinar plano mensal",
  },
  {
    name: "Fidelidade",
    description: "Alugue e, ao final do contrato, o veículo é transferido para você.",
    priceLabel: brl(FIDELIDADE.carro.diaria),
    pricePrefix: "carro a partir de",
    unit: "/dia",
    features: [
      "O veículo fica seu ao final do contrato",
      "Carro (ex.: Polo Track, 48 meses) — caução R$ 7.000",
      `Moto CG 160 Start a partir de ${brl(FIDELIDADE.moto[0].semanal)}/sem`,
      "Documentação, seguro e assistência inclusos",
    ],
    highlight: true,
    tag: "O veículo fica seu",
    naSecao: true,
    cta: "Quero o plano Fidelidade",
  },
];

export type Feature = {
  icon: string;
  title: string;
  text: string;
};

export const FEATURES: Feature[] = [
  {
    icon: "ShieldCheck",
    title: "Proteção inclusa",
    text: "Cobertura para danos ao veículo e a terceiros em todos os planos.",
  },
  {
    icon: "CalendarClock",
    title: "Diárias flexíveis",
    text: "Alugue por dia, semana ou mês — você escolhe o período ideal.",
  },
  {
    icon: "Headset",
    title: "Suporte 24h",
    text: "Atendimento e assistência a qualquer hora, todos os dias.",
  },
  {
    icon: "FileCheck2",
    title: "Sem burocracia",
    text: "Cadastro pelo chat em minutos e retirada no mesmo dia.",
  },
  {
    icon: "Store",
    title: "Retirada sem agendamento",
    text: "Nada de marcar horário: confirmou a disponibilidade, é só retirar na loja.",
  },
  {
    icon: "Wrench",
    title: "Estrutura completa na sede",
    text: "Oficina, borracharia, abastecimento e lavagem próprios — manutenção preventiva a cada 10 mil km.",
  },
];

export type Step = {
  title: string;
  text: string;
};

export const STEPS: Step[] = [
  {
    title: "Escolha o veículo",
    text: "Compactos, hatchs, sedans ou a CG 160 — encontre o ideal na nossa frota.",
  },
  {
    title: "Converse com o assistente",
    text: "Nosso assistente virtual faz seu cadastro em minutos e envia os dados direto para a nossa equipe.",
  },
  {
    title: "Confirme no WhatsApp e retire",
    text: "Você é redirecionado ao WhatsApp para confirmar e retira o veículo na loja — sem agendamento.",
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ricardo Lima",
    role: "Motorista de aplicativo",
    quote:
      "Alugo carro com a MCM há mais de um ano para trabalhar. Nunca fiquei na mão e o suporte resolve tudo rápido.",
  },
  {
    name: "Camila Souza",
    role: "Empresária",
    quote:
      "Contratei a frota mensal para minha equipe. Processo sem burocracia e carros sempre impecáveis.",
  },
  {
    name: "André Martins",
    role: "Turista",
    quote:
      "Passei uma semana em Manaus e aluguei um sedan. Retirada rápida na loja e atendimento nota 10.",
  },
];

export type Faq = {
  q: string;
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "O que é preciso para alugar?",
    a: "Para efetivar a locação é necessário o preenchimento do cadastro e a apresentação da CNH. Para motoristas de aplicativo: ter mais de 25 anos, CNH há pelo menos 2 anos com EAR (atividade remunerada), garagem apropriada e não possuir débitos em outras locadoras.",
  },
  {
    q: "Quais planos estão disponíveis?",
    a: "Temos planos de locação por diária, mensal e por assinatura, além de planos semanais para motoristas de aplicativo (com caução na retirada) e o plano Fidelidade, em que o veículo é transferido para você ao final do contrato.",
  },
  {
    q: "Como funciona o plano Fidelidade?",
    a: "No plano Fidelidade, ao final do contrato o veículo (carro ou moto) é transferido ao locatário — você paga pelo que será seu. Consulte nossa equipe para as condições e prazos.",
  },
  {
    q: "Preciso agendar a retirada?",
    a: "Não. A MCM não trabalha com agendamento de retirada: você faz o cadastro pelo chat do site ou pelo WhatsApp, nossa equipe confirma a disponibilidade e você retira o veículo direto na loja, no Distrito Industrial.",
  },
  {
    q: "Na locação para aplicativo tem km livre?",
    a: "Não. Os planos para motoristas de app têm franquias de 1250, 1500 ou 1750 km por semana. A apuração da quilometragem é feita a cada 4 semanas e o excedente, quando houver, é cobrado por fatura/boleto.",
  },
  {
    q: "Como posso pagar a locação?",
    a: "Aceitamos PIX, cartão de débito, crédito ou transferência. O depósito da caução pode ser parcelado em até 12x no cartão de crédito (com juros) e as renovações semanais são pagas por boleto.",
  },
  {
    q: "Em quanto tempo a caução é devolvida?",
    a: "A caução é devolvida em 15 dias após o encerramento do contrato, descontados eventuais débitos remanescentes.",
  },
  {
    q: "Como funciona a manutenção?",
    a: "As manutenções preventivas (a cada 10 mil km) e corretivas por desgaste natural são feitas pela locadora, na nossa oficina própria. Manutenções por mau uso ficam por conta do cliente.",
  },
  {
    q: "Como funciona a proteção?",
    a: "A proteção cobre danos ao veículo e a terceiros, com coparticipação obrigatória. Em caso de sinistro são necessários Boletim de Ocorrência, fotos e CNH dos envolvidos.",
  },
];

export const STATS = [
  { value: "27", suffix: " anos", label: "de experiência no mercado" },
  { value: "5.700", suffix: "+", label: "clientes atendidos" },
  { value: "500", suffix: "+", label: "veículos na frota" },
  { value: "24", suffix: "h", label: "de suporte todos os dias" },
];

// Envio de leads da MCM Rent a Car.
//
// 1) E-mail COM A IDENTIDADE DA MCM via EmailJS (template branded, sem backend).
//    Funciona direto do navegador — inclusive em dev.
// 2) Fallback: FormSubmit (tabela simples) caso o EmailJS falhe, para não perder o lead.

import { COMPANY } from "./data";

// ⚠️ MODO TESTE: destino dos leads. Para produção, deixe EMAIL_TESTE = ""
// (aí usa COMPANY.email) e ajuste o "To Email" do template no EmailJS.
const EMAIL_TESTE = "arthuriquesconta1@gmail.com";
const LEAD_EMAIL = EMAIL_TESTE || COMPANY.email;

// Credenciais públicas do EmailJS (podem ficar no front — não são secretas).
const EMAILJS = {
  serviceId: "service_rq3sjeb",
  templateId: "template_74vr2pq",
  publicKey: "7Jc5TOyG8WStjR43w",
};

export async function enviarEmailLoja(
  assunto: string,
  dados: Record<string, string>
): Promise<boolean> {
  // 1) E-mail branded via EmailJS.
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: paramsEmailJS(assunto, dados),
      }),
    });
    if (res.ok) return true;
    // Erro (credencial, origem, etc.) → cai no fallback.
  } catch {
    /* sem rede / EmailJS fora do ar → fallback */
  }

  // 2) Fallback: FormSubmit.
  return enviarViaFormSubmit(assunto, dados);
}

/** Mapeia os dados do cadastro para as variáveis {{...}} do template do EmailJS. */
function paramsEmailJS(assunto: string, d: Record<string, string>): Record<string, string> {
  const categoria = d["Categoria"] ?? "";
  const plano = d["Plano"] ?? "";
  const periodo = d["Período"] ?? "";
  const subinfo = [categoria, plano, periodo].filter((s) => s && s !== "—").join(" · ");
  return {
    subject: assunto,
    to_email: LEAD_EMAIL,
    reply_to: d["E-mail"] ?? "",
    veiculo: d["Veículo"] || categoria || "Veículo a definir",
    subinfo,
    nome: d["Nome"] ?? "",
    cpf: d["CPF"] ?? "",
    nascimento: d["Data de nascimento"] ?? "",
    estado_civil: d["Estado civil"] ?? "",
    whatsapp: d["WhatsApp"] ?? "",
    email: d["E-mail"] ?? "",
    endereco: d["Endereço"] ?? "",
    cnh: d["Possui CNH"] ?? "",
    categoria,
    plano,
    periodo: periodo || "—",
    obs: d["Observação"] ?? "—",
  };
}

async function enviarViaFormSubmit(
  assunto: string,
  dados: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: assunto,
        _template: "table",
        _captcha: "false",
        ...dados,
      }),
    });
    if (!res.ok) return false;
    const json: { success?: string | boolean } | null = await res.json().catch(() => null);
    return json?.success === "true" || json?.success === true;
  } catch {
    return false;
  }
}

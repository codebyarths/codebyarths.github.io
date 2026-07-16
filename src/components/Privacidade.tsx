import { ArrowLeft, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/data";
import { asset } from "@/lib/asset";

const ATUALIZADA_EM = "16 de julho de 2026";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-neutral-50 text-charcoal">
      {/* Topo */}
      <header className="bg-ink pt-[env(safe-area-inset-top)] text-white">
        <div className="container-x flex h-[72px] items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label={COMPANY.name}>
            <img
              src={asset("brand/logo-mcm.jpg")}
              alt={COMPANY.name}
              className="h-11 w-auto rounded-md ring-1 ring-white/10"
            />
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </a>
        </div>
      </header>

      <main className="container-x max-w-3xl py-12 lg:py-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
          <ShieldCheck className="h-4 w-4" /> Proteção de dados
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-charcoal/55">
          Última atualização: {ATUALIZADA_EM}
        </p>

        <div className="prose-mcm mt-8 space-y-8">
          <Secao titulo="1. Quem somos (controlador dos dados)">
            <p>
              A <strong>{COMPANY.name}</strong> ({COMPANY.address}), inscrita no CNPJ{" "}
              {COMPANY.cnpj}, é a responsável (controladora) pelo tratamento dos dados pessoais
              coletados neste site. Para qualquer assunto sobre seus dados, fale com a gente pelo
              e-mail{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-brand-700 underline">
                {COMPANY.email}
              </a>{" "}
              ou pelo telefone {COMPANY.phone}.
            </p>
          </Secao>

          <Secao titulo="2. Quais dados coletamos">
            <p>Ao fazer um cadastro ou solicitação de reserva pelo nosso assistente, coletamos:</p>
            <ul>
              <li>Nome completo</li>
              <li>CPF</li>
              <li>Data de nascimento</li>
              <li>Estado civil</li>
              <li>Telefone / WhatsApp e e-mail</li>
              <li>Endereço (CEP, logradouro, número, complemento, bairro e cidade)</li>
              <li>Informação sobre possuir CNH válida</li>
              <li>Preferências da locação (categoria, veículo, plano e período)</li>
            </ul>
            <p>
              Coletamos apenas o necessário para avaliar e efetivar a locação. Uma cópia do seu
              cadastro pode ficar salva localmente no seu próprio navegador (para sua comodidade) e
              é enviada por e-mail à nossa equipe.
            </p>
          </Secao>

          <Secao titulo="3. Para que usamos seus dados">
            <ul>
              <li>Analisar seu perfil e efetivar a locação de veículos;</li>
              <li>Entrar em contato para confirmar a reserva e prestar atendimento;</li>
              <li>Emitir contratos, cobranças e cumprir obrigações legais e regulatórias;</li>
              <li>Identificar responsáveis por multas e infrações de trânsito, quando aplicável.</li>
            </ul>
          </Secao>

          <Secao titulo="4. Base legal (LGPD)">
            <p>
              Tratamos seus dados com base na <strong>execução de contrato</strong> e nos
              procedimentos preliminares à locação, no <strong>cumprimento de obrigações legais</strong>{" "}
              e no seu <strong>consentimento</strong>, coletado no momento do cadastro. Você pode
              retirar o consentimento a qualquer momento (veja a seção 7).
            </p>
          </Secao>

          <Secao titulo="5. Com quem compartilhamos">
            <p>Seus dados podem ser compartilhados apenas quando necessário, com:</p>
            <ul>
              <li>Nossa equipe interna responsável pela locação e atendimento;</li>
              <li>
                Prestadores de serviço que operam a infraestrutura do site e o envio de e-mails
                (nesse caso, os dados podem ser processados em servidores fora do Brasil, com as
                devidas salvaguardas);
              </li>
              <li>Seguradora / empresa de proteção veicular, quando houver contratação;</li>
              <li>
                Órgãos de trânsito e autoridades públicas, quando exigido por lei (ex.:
                identificação de condutor em multas).
              </li>
            </ul>
            <p>Não vendemos nem alugamos seus dados pessoais a terceiros.</p>
          </Secao>

          <Secao titulo="6. Por quanto tempo guardamos">
            <p>
              Mantemos seus dados pelo tempo necessário à prestação do serviço e ao cumprimento de
              obrigações legais, contratuais e fiscais. Após o término da relação, os dados podem
              ser mantidos pelos prazos legais aplicáveis (em geral, até 5 anos) e, depois,
              eliminados de forma segura.
            </p>
          </Secao>

          <Secao titulo="7. Seus direitos">
            <p>A qualquer momento, você pode solicitar:</p>
            <ul>
              <li>Confirmação de que tratamos seus dados e acesso a eles;</li>
              <li>Correção de dados incompletos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade e informação sobre compartilhamentos;</li>
              <li>Revogação do consentimento.</li>
            </ul>
            <p>
              Para exercer seus direitos, basta enviar um e-mail para{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-brand-700 underline">
                {COMPANY.email}
              </a>
              . Responderemos no menor prazo possível.
            </p>
          </Secao>

          <Secao titulo="8. Segurança">
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos
              não autorizados, perda ou uso indevido. Ainda assim, nenhum sistema é 100% infalível —
              por isso, tratamos apenas os dados necessários e por tempo limitado.
            </p>
          </Secao>

          <Secao titulo="9. Alterações desta política">
            <p>
              Podemos atualizar esta Política periodicamente. A data da última atualização estará
              sempre indicada no topo desta página.
            </p>
          </Secao>

          <Secao titulo="10. Contato">
            <p>
              Dúvidas sobre esta Política ou sobre seus dados? Fale com a {COMPANY.short} pelo
              e-mail{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-brand-700 underline">
                {COMPANY.email}
              </a>{" "}
              ou pelo telefone/WhatsApp {COMPANY.phone}.
            </p>
          </Secao>
        </div>

        <div className="mt-12 border-t border-charcoal/10 pt-6">
          <a href="/" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </a>
        </div>
      </main>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-ink">{titulo}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-charcoal/75 [&_a]:break-words [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

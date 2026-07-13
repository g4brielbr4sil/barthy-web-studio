import { barthyWhatsappUrl } from "../data/content";

export interface LeadPayload {
  nome: string;
  whatsapp: string;
  email?: string;
  empresa?: string;
  cidadeUf: string;
  tipoServico: string;
  mensagem: string;
}

export interface LeadResult {
  /** Canal realmente usado. Nunca dizemos "hermes" sem ter chamado o endpoint. */
  via: "hermes" | "whatsapp";
}

export class NoContactChannelError extends Error {
  constructor() {
    super("Nenhum canal de contato configurado (Hermes ou WhatsApp).");
    this.name = "NoContactChannelError";
  }
}

/** Mensagem pronta usada no fallback de WhatsApp. */
function buildWhatsappMessage(p: LeadPayload): string {
  return (
    `Olá, tenho interesse em organizar a presença digital do meu negócio.\n\n` +
    `Nome: ${p.nome || "-"}\n` +
    `WhatsApp: ${p.whatsapp || "-"}\n` +
    `E-mail: ${p.email || "-"}\n` +
    `Empresa/projeto: ${p.empresa || "-"}\n` +
    `Cidade/UF: ${p.cidadeUf || "-"}\n` +
    `Serviço de interesse: ${p.tipoServico || "-"}\n` +
    `Mensagem: ${p.mensagem || "-"}`
  );
}

/**
 * Envia o lead para o Hermes (se o endpoint estiver configurado) ou faz
 * fallback real para o WhatsApp. Não finge integração: só retorna
 * `via: "hermes"` quando o POST realmente aconteceu com sucesso.
 *
 * Variáveis de ambiente:
 * - VITE_HERMES_LEAD_ENDPOINT  → URL do endpoint que recebe o lead
 * - VITE_BARTHY_WHATSAPP_URL   → URL base do WhatsApp (ex.: https://wa.me/5561...)
 */
export async function submitLeadToHermes(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = (import.meta.env.VITE_HERMES_LEAD_ENDPOINT as string | undefined)?.trim();

  // Opção A — endpoint real do Hermes
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        origem: "site_barthy",
        status: "novo_lead_site",
        createdAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      throw new Error(`Hermes respondeu ${res.status}`);
    }
    return { via: "hermes" };
  }

  // Opção B — fallback funcional para WhatsApp
  const waUrl = barthyWhatsappUrl(buildWhatsappMessage(payload));
  if (waUrl) {
    window.open(waUrl, "_blank", "noopener,noreferrer");
    return { via: "whatsapp" };
  }

  // Nenhum canal configurado: erro claro, sem fingir sucesso.
  throw new NoContactChannelError();
}

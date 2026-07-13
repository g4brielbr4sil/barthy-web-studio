/**
 * Tracking leve de eventos de conversão.
 *
 * Por enquanto: apenas console.log em desenvolvimento e no-op em produção.
 * Nenhum script externo (Google Analytics, Meta Pixel etc.) é carregado.
 * Quando quiser plugar um provedor, basta encaminhar `name`/`payload` aqui.
 */
export type TrackEvent =
  | "click_header_cta"
  | "click_hero_cta"
  | "click_package_cta"
  | "click_problem_cta"
  | "click_service_chip"
  | "click_crm_cta"
  | "click_experience_link"
  | "click_products_cta"
  | "submit_quote_form"
  | "submit_quote_success"
  | "submit_quote_error"
  | "click_whatsapp";

export function trackEvent(name: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[track] ${name}`, payload);
  }
  // Produção: no-op (integração futura com provedor de analytics).
}

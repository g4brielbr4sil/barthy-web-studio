/**
 * Tracking leve de eventos de conversão.
 *
 * Por enquanto: apenas console.log em desenvolvimento e no-op em produção.
 * Nenhum script externo (Google Analytics, Meta Pixel etc.) é carregado.
 * Quando quiser plugar um provedor, basta encaminhar `name`/`payload` aqui.
 */
export type TrackEvent =
  | "cta_click"
  | "toggle_experience_details"
  | "submit_quote_form"
  | "submit_quote_success"
  | "submit_quote_error";

export function trackEvent(name: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[track] ${name}`, payload);
  }
  // Produção: no-op (integração futura com provedor de analytics).
}

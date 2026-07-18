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
  | "toggle_disclosure"
  | "toggle_faq"
  | "form_started"
  | "form_error"
  | "submit_quote_form"
  | "submit_quote_success"
  | "submit_quote_error"
  | "theme_change"
  | "dev_mode_open";

export function trackEvent(name: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[track] ${name}`, payload);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("barthy:tracking", {
        detail: { name, payload },
      }),
    );
  }
  // Produção: sem provedor externo. O evento local alimenta apenas a sessão atual.
}

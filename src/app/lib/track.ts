/**
 * Tracking leve de eventos de conversão.
 *
 * Por enquanto: apenas console.log em desenvolvimento e no-op em produção.
 * Nenhum script externo (Google Analytics, Meta Pixel etc.) é carregado.
 * Quando quiser plugar um provedor, basta encaminhar `name`/`payload` aqui.
 */
export interface TrackEventPayloads {
  cta_click: { source: string; destination: string };
  toggle_experience_details: { title: string };
  toggle_disclosure: { source: string };
  toggle_faq: { index: number };
  form_started: undefined;
  form_error: { field: string };
  submit_quote_form: undefined;
  submit_quote_success: { via: "hermes" | "whatsapp" };
  submit_quote_error: undefined;
  theme_change: { theme: "light" | "dark" };
  dev_mode_open: undefined;
}

export type TrackEvent = keyof TrackEventPayloads;

type TrackArguments<K extends TrackEvent> = TrackEventPayloads[K] extends undefined
  ? [payload?: undefined]
  : [payload: TrackEventPayloads[K]];

export function trackEvent<K extends TrackEvent>(
  name: K,
  ...args: TrackArguments<K>
): void {
  const payload = args[0] ?? {};
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

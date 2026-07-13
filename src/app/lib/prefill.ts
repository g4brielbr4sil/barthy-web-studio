/**
 * Ponte simples para pré-preencher o formulário de orçamento a partir de
 * qualquer CTA da página (pacotes, chips de serviço, seção de CRM etc.).
 *
 * O CTA navega para #contato (via <a href>) e chama prefillQuote() com o
 * contexto; o QuoteForm escuta o evento e preenche os campos.
 */
export interface PrefillDetail {
  service?: string;
  note?: string;
}

export const PREFILL_EVENT = "barthy:prefill";

export function prefillQuote(detail: PrefillDetail): void {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
}

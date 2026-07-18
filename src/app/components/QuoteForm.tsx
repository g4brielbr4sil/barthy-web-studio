import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, Loader2, Check, AlertTriangle, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import {
  Container,
  LinkButton,
  Section,
  SectionHeading,
  Button,
} from "./ui-primitives";
import {
  serviceOptions,
  contactHref,
  barthyWhatsappUrl,
} from "../data/content";
import { submitLeadToHermes, NoContactChannelError } from "../lib/hermes";
import { trackEvent } from "../lib/track";
import { PREFILL_EVENT, type PrefillDetail } from "../lib/prefill";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ice-blue)]/70 focus:ring-2 focus:ring-[var(--ice-blue)]/20 transition min-w-0";

type Status = "idle" | "loading" | "success" | "error";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [, setVia] = useState<"hermes" | "whatsapp" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Prefill vindo de CTAs (pacotes, chips de serviço, seção de CRM).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail || {};
      if (detail.service) setService(detail.service);
      if (detail.note) {
        setMessage((prev) => (prev ? prev : detail.note ?? ""));
      }
    };
    window.addEventListener(PREFILL_EVENT, handler as EventListener);
    return () => window.removeEventListener(PREFILL_EVENT, handler as EventListener);
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const data = new FormData(e.currentTarget);
    const payload = {
      nome: (data.get("nome") as string) || "",
      whatsapp: (data.get("whatsapp") as string) || "",
      email: ((data.get("email") as string) || "").trim(),
      empresa: ((data.get("empresa") as string) || "").trim(),
      cidadeUf: ((data.get("cidadeUf") as string) || "").trim(),
      tipoServico: (data.get("tipoServico") as string) || "",
      mensagem: (data.get("mensagem") as string) || "",
    };

    trackEvent("submit_quote_form", { cidadeUf: payload.cidadeUf, tipoServico: payload.tipoServico });
    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitLeadToHermes(payload);
      setVia(result.via);
      setStatus("success");
      trackEvent("submit_quote_success", { via: result.via });
    } catch (err) {
      // Mensagem única e neutra — sem expor detalhes técnicos na UI pública.
      void (err instanceof NoContactChannelError);
      setStatus("error");
      setErrorMsg(
        "Não foi possível enviar agora. Tente novamente ou utilize um dos canais de contato disponíveis.",
      );
      trackEvent("submit_quote_error");
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    setService("");
    setMessage("");
    setVia(null);
    setStatus("idle");
  };

  const hasWhatsapp = !!barthyWhatsappUrl();

  return (
    <Section id="contato">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Contato"
              title="Vamos organizar o próximo passo do seu projeto?"
              description="Conte o que precisa apresentar, captar ou estruturar. A partir disso, indicamos o próximo passo."
            />
            <p className="-mt-8 mb-8 text-[var(--muted-foreground)]" style={{ fontSize: "0.86rem" }}>
              Base em Brasília, com atendimento digital em todo o Brasil.
            </p>
            {hasWhatsapp && (
              <div className="flex flex-col gap-3">
                <LinkButton
                  href={contactHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => trackEvent("click_whatsapp", { location: "form_sidebar" })}
                >
                  <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
                </LinkButton>
              </div>
            )}
          </div>

          {/* Estado de sucesso */}
          {status === "success" ? (
            <div className="rounded-2xl glass p-6 md:p-8 flex flex-col gap-4">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--ice-blue)]/15 text-[var(--ice-blue)]"
              >
                <Check className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="text-[var(--foreground)]">Solicitação recebida.</h3>
                <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.93rem" }}>
                  Seu contato foi registrado. A Barthy vai analisar as informações e retornar com os
                  próximos passos.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                {hasWhatsapp && (
                  <LinkButton
                    href={contactHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="w-full sm:w-auto"
                    onClick={() => trackEvent("click_whatsapp", { location: "form_success" })}
                  >
                    <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
                  </LinkButton>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={resetForm}
                >
                  <RotateCcw className="w-4 h-4" /> Enviar outra solicitação
                </Button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit} className="rounded-2xl glass p-6 md:p-8 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" name="nome" type="text" required className={inputCls} placeholder="Seu nome" />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input id="whatsapp" name="whatsapp" type="tel" required className={inputCls} placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="email">E-mail (opcional)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={inputCls}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="empresa">Empresa ou projeto</label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    className={inputCls}
                    placeholder="Nome da empresa ou projeto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="cidadeUf">Cidade/UF</label>
                  <input
                    id="cidadeUf"
                    name="cidadeUf"
                    type="text"
                    required
                    className={inputCls}
                    placeholder="Digite sua cidade e estado"
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="tipoServico">Tipo de solução</label>
                  <select
                    id="tipoServico"
                    name="tipoServico"
                    required
                    className={inputCls}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione…
                    </option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={4}
                  className={inputCls}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte um pouco sobre o seu negócio e o que precisa."
                />
              </div>

              {/* Microinteração de loading */}
              {status === "loading" && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                  <motion.div
                    className="h-full bg-[var(--terra)]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                    style={{ width: "50%" }}
                  />
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[var(--terra)]/40 bg-[var(--terra)]/10 p-3 text-[var(--foreground)]"
                  style={{ fontSize: "0.86rem" }}
                >
                  <AlertTriangle className="mt-0.5 w-4 h-4 text-[var(--terra)] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto"
                  aria-busy={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Falar sobre meu projeto
                    </>
                  )}
                </Button>
                {status === "error" && hasWhatsapp && (
                  <LinkButton
                    href={contactHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => trackEvent("click_whatsapp", { location: "form_error" })}
                  >
                    <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
                  </LinkButton>
                )}
              </div>

              <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.78rem" }}>
                Seus dados serão usados apenas para responder à sua solicitação.
              </p>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default QuoteForm;

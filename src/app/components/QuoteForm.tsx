import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Container,
  LinkButton,
  Section,
  SectionHeading,
  Button,
} from "./ui-primitives";
import {
  serviceOptionGroups,
  resolveServiceOption,
  contactHref,
  barthyWhatsappUrl,
} from "../data/content";
import { submitLeadToHermes } from "../lib/hermes";
import { trackEvent } from "../lib/track";
import { PREFILL_EVENT, type PrefillDetail } from "../lib/prefill";
import { FormSuccessCelebration } from "./FormSuccessCelebration";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ice-blue)]/70 focus:ring-2 focus:ring-[var(--ice-blue)]/20 transition min-w-0";
const invalidInputCls =
  "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/25";

type Status = "idle" | "loading" | "success" | "error";
type FieldName =
  | "nome"
  | "whatsapp"
  | "email"
  | "cidadeUf"
  | "tipoServico"
  | "mensagem";
type FieldErrors = Partial<Record<FieldName, string>>;

const MESSAGE_LIMIT = 2_000;
const fieldOrder: FieldName[] = [
  "nome",
  "whatsapp",
  "email",
  "cidadeUf",
  "tipoServico",
  "mensagem",
];

function formValue(data: FormData, field: string): string {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

function isPrefillDetail(value: unknown): value is PrefillDetail {
  if (typeof value !== "object" || value === null) return false;
  const service = "service" in value ? value.service : undefined;
  const note = "note" in value ? value.note : undefined;
  return (
    (service === undefined || typeof service === "string") &&
    (note === undefined || typeof note === "string")
  );
}

function validateWhatsapp(value: string): string | undefined {
  if (!value.trim()) return "Informe seu WhatsApp.";

  const digits = value.replace(/\D/g, "");
  const localDigits =
    digits.startsWith("55") && (digits.length === 12 || digits.length === 13)
      ? digits.slice(2)
      : digits;

  if (
    (localDigits.length !== 10 && localDigits.length !== 11) ||
    !/^[1-9]\d/.test(localDigits)
  ) {
    return "Digite um número com DDD.";
  }

  if (/^(\d)\1+$/.test(localDigits)) {
    return "Verifique o número informado.";
  }

  return undefined;
}

function getFieldErrors(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form);
  const errors: FieldErrors = {};
  const nome = formValue(data, "nome").trim();
  const whatsapp = formValue(data, "whatsapp");
  const email = formValue(data, "email").trim();
  const cidadeUf = formValue(data, "cidadeUf").trim();
  const tipoServico = formValue(data, "tipoServico");
  const mensagem = formValue(data, "mensagem");
  const emailElement = form.elements.namedItem("email");
  const emailInput = emailElement instanceof HTMLInputElement ? emailElement : null;

  if (!nome) errors.nome = "Informe seu nome.";
  else if (nome.length < 2) errors.nome = "Digite pelo menos 2 caracteres.";

  const whatsappError = validateWhatsapp(whatsapp);
  if (whatsappError) errors.whatsapp = whatsappError;

  if (email && emailInput?.validity.typeMismatch) {
    errors.email = "Digite um e-mail válido.";
  }

  if (!cidadeUf) errors.cidadeUf = "Informe sua cidade e UF.";
  if (!tipoServico) errors.tipoServico = "Selecione um tipo de solução.";
  if (mensagem.length > MESSAGE_LIMIT) {
    errors.mensagem = `Limite a mensagem a ${MESSAGE_LIMIT} caracteres.`;
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-[var(--destructive)]"
      style={{ fontSize: "0.8rem" }}
    >
      {message}
    </p>
  );
}

export function QuoteForm() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [, setVia] = useState<"hermes" | "whatsapp" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const formStartedRef = useRef(false);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  // Prefill vindo de CTAs (pacotes, chips de serviço, seção de CRM).
  useEffect(() => {
    const handler: EventListener = (event) => {
      if (!(event instanceof CustomEvent) || !isPrefillDetail(event.detail)) return;
      const detail = event.detail;
      if (detail.service) {
        setService(resolveServiceOption(detail.service));
        setFieldErrors((current) => {
          if (!current.tipoServico) return current;
          const next = { ...current };
          delete next.tipoServico;
          return next;
        });
      }
      if (detail.note) {
        setMessage((prev) => (prev ? prev : detail.note ?? ""));
      }
    };
    window.addEventListener(PREFILL_EVENT, handler);
    return () => window.removeEventListener(PREFILL_EVENT, handler);
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading" || submittingRef.current) return;
    const form = e.currentTarget;
    const validationErrors = getFieldErrors(form);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus("idle");
      setErrorMsg("");
      const firstInvalidField = fieldOrder.find((field) => validationErrors[field]);
      if (firstInvalidField) {
        const invalidElement = form.elements.namedItem(firstInvalidField);
        if (invalidElement instanceof HTMLElement) invalidElement.focus();
      }
      Object.keys(validationErrors).forEach((field) => {
        trackEvent("form_error", { field });
      });
      return;
    }

    setFieldErrors({});
    const data = new FormData(form);
    const payload = {
      nome: formValue(data, "nome"),
      whatsapp: formValue(data, "whatsapp"),
      email: formValue(data, "email").trim(),
      empresa: formValue(data, "empresa").trim(),
      cidadeUf: formValue(data, "cidadeUf").trim(),
      tipoServico: formValue(data, "tipoServico"),
      mensagem: formValue(data, "mensagem"),
    };

    trackEvent("cta_click", { source: "final-cta", destination: "contato" });
    trackEvent("submit_quote_form");
    submittingRef.current = true;
    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitLeadToHermes(payload);
      if (!mountedRef.current) return;
      setVia(result.via);
      setStatus("success");
      trackEvent("submit_quote_success", { via: result.via });
    } catch {
      if (!mountedRef.current) return;
      // Mensagem única e neutra — sem expor detalhes técnicos na UI pública.
      setStatus("error");
      setErrorMsg(
        "Não foi possível enviar agora. Tente novamente ou utilize um dos canais de contato disponíveis.",
      );
      trackEvent("submit_quote_error");
    } finally {
      submittingRef.current = false;
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    setService("");
    setMessage("");
    setVia(null);
    setStatus("idle");
    setErrorMsg("");
    setFieldErrors({});
    formStartedRef.current = false;
    submittingRef.current = false;
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
                  data-cta-source="final-cta"
                  onClick={() =>
                    trackEvent("cta_click", {
                      source: "final-cta",
                      destination: "whatsapp",
                    })
                  }
                >
                  <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
                </LinkButton>
              </div>
            )}
          </div>

          {/* Estado de sucesso */}
          {status === "success" ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.36, ease: [0.22, 1, 0.36, 1] }
              }
              data-form-success="true"
              className="relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 glass md:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(420px 220px at 12% 8%, rgba(74,127,167,0.18), transparent 70%)",
                }}
              />
              <FormSuccessCelebration />
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
                    data-cta-source="final-cta"
                    onClick={() =>
                      trackEvent("cta_click", {
                        source: "final-cta",
                        destination: "whatsapp",
                      })
                    }
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
            </motion.div>
          ) : (
            <form
              ref={formRef}
              onSubmit={submit}
              onInput={() => {
                if (formStartedRef.current) return;
                formStartedRef.current = true;
                trackEvent("form_started");
              }}
              noValidate
              className="rounded-2xl glass p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    className={`${inputCls} ${fieldErrors.nome ? invalidInputCls : ""}`}
                    placeholder="Seu nome"
                    aria-invalid={fieldErrors.nome ? "true" : undefined}
                    aria-describedby={fieldErrors.nome ? "nome-error" : undefined}
                    onChange={() => clearFieldError("nome")}
                  />
                  <FieldError id="nome-error" message={fieldErrors.nome} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    maxLength={24}
                    className={`${inputCls} ${fieldErrors.whatsapp ? invalidInputCls : ""}`}
                    placeholder="(00) 00000-0000"
                    aria-invalid={fieldErrors.whatsapp ? "true" : undefined}
                    aria-describedby={fieldErrors.whatsapp ? "whatsapp-error" : undefined}
                    onChange={() => clearFieldError("whatsapp")}
                  />
                  <FieldError id="whatsapp-error" message={fieldErrors.whatsapp} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="email">E-mail (opcional)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    className={`${inputCls} ${fieldErrors.email ? invalidInputCls : ""}`}
                    placeholder="seu@email.com"
                    aria-invalid={fieldErrors.email ? "true" : undefined}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    onChange={() => clearFieldError("email")}
                  />
                  <FieldError id="email-error" message={fieldErrors.email} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="empresa">Empresa ou projeto</label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    maxLength={160}
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
                    maxLength={120}
                    className={`${inputCls} ${fieldErrors.cidadeUf ? invalidInputCls : ""}`}
                    placeholder="Digite sua cidade e estado"
                    aria-invalid={fieldErrors.cidadeUf ? "true" : undefined}
                    aria-describedby={fieldErrors.cidadeUf ? "cidadeUf-error" : undefined}
                    onChange={() => clearFieldError("cidadeUf")}
                  />
                  <FieldError id="cidadeUf-error" message={fieldErrors.cidadeUf} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label htmlFor="tipoServico">Tipo de solução</label>
                  <select
                    id="tipoServico"
                    name="tipoServico"
                    required
                    className={`${inputCls} ${fieldErrors.tipoServico ? invalidInputCls : ""}`}
                    value={service}
                    aria-invalid={fieldErrors.tipoServico ? "true" : undefined}
                    aria-describedby={fieldErrors.tipoServico ? "tipoServico-error" : undefined}
                    onChange={(e) => {
                      setService(e.target.value);
                      clearFieldError("tipoServico");
                    }}
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {serviceOptionGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <FieldError id="tipoServico-error" message={fieldErrors.tipoServico} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={4}
                  maxLength={MESSAGE_LIMIT}
                  className={inputCls}
                  value={message}
                  aria-invalid={fieldErrors.mensagem ? "true" : undefined}
                  aria-describedby={fieldErrors.mensagem ? "mensagem-error" : undefined}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearFieldError("mensagem");
                  }}
                  placeholder="Conte um pouco sobre o seu negócio e o que precisa."
                />
                <FieldError id="mensagem-error" message={fieldErrors.mensagem} />
              </div>

              {/* Microinteração de loading */}
              {status === "loading" && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                  <motion.div
                    className="h-full bg-[var(--terra)]"
                    initial={reduceMotion ? false : { x: "-100%" }}
                    animate={reduceMotion ? undefined : { x: "100%" }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { repeat: Infinity, duration: 1.1, ease: "easeInOut" }
                    }
                    style={{ width: reduceMotion ? "100%" : "50%" }}
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
                  data-cta-source="final-cta"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className={`h-4 w-4 ${reduceMotion ? "" : "animate-spin"}`} />{" "}
                      Enviando...
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
                    data-cta-source="final-cta"
                    onClick={() =>
                      trackEvent("cta_click", {
                        source: "final-cta",
                        destination: "whatsapp",
                      })
                    }
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

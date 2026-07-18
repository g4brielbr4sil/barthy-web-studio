import { Instagram, Linkedin, Mail } from "lucide-react";
import { BarthyLogo } from "./BarthyLogo";
import { Container } from "./ui-primitives";
import { siteConfig } from "../data/content";
import { trackEvent } from "../lib/track";
import { DevModeLauncher } from "./DevModeLauncher";

export function Footer() {
  const socials = [
    { Icon: Instagram, href: siteConfig.instagram, label: "Instagram" },
    { Icon: Linkedin, href: siteConfig.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <BarthyLogo />
            <p className="mt-5 text-[var(--muted-foreground)] max-w-xs" style={{ fontSize: "0.9rem" }}>
              Soluções digitais organizadas para empresas, profissionais e operações que precisam
              apresentar, conectar e evoluir com clareza.
            </p>
          </div>

          <div>
            <div
              className="text-[var(--ice-blue)] mb-4"
              style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Localização
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
              Base em Brasília, com atendimento digital em todo o Brasil.
            </p>
          </div>

          <div>
            <div
              className="text-[var(--ice-blue)] mb-4"
              style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Contato
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              data-cta-source="footer"
              onClick={() =>
                trackEvent("cta_click", {
                  source: "footer",
                  destination: "email",
                })
              }
              className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--terra)] transition-colors break-all"
              style={{ fontSize: "0.92rem" }}
            >
              <Mail className="w-4 h-4 shrink-0" />
              {siteConfig.email}
            </a>
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-cta-source="footer"
                    onClick={() =>
                      trackEvent("cta_click", {
                        source: "footer",
                        destination: label.toLowerCase(),
                      })
                    }
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--ice-blue)]/60 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 text-[var(--muted-foreground)] md:flex-row md:items-center" style={{ fontSize: "0.8rem" }}>
          <div className="flex min-w-0 flex-col gap-2">
            <span>© {new Date().getFullYear()} Barthy Web Studio. Todos os direitos reservados.</span>
            <span style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Tecnologia organizada para operações reais.
            </span>
          </div>
          <DevModeLauncher />
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

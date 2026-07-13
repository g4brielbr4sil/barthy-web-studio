import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BarthyLogo } from "./BarthyLogo";
import { ThemeToggle } from "./ThemeToggle";
import { LinkButton } from "./ui-primitives";
import { trackEvent } from "../lib/track";

const nav = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Sistemas", href: "#sistemas" },
  { label: "Produtos", href: "#produtos" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Pacotes", href: "#pacotes" },
  { label: "Como trabalhamos", href: "#como-trabalhamos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Fecha o menu mobile com Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[var(--background)]/70 border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8 h-[64px] md:h-[72px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        <a href="#inicio" className="min-w-0 shrink truncate">
          <BarthyLogo />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              style={{ fontSize: "0.92rem" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <LinkButton
            href="#contato"
            className="hidden md:inline-flex"
            onClick={() => trackEvent("click_header_cta", { location: "desktop" })}
          >
            Falar sobre meu projeto
          </LinkButton>
          <button
            type="button"
            className="lg:hidden shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
          <div className="px-5 py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                {item.label}
              </a>
            ))}
            <LinkButton
              href="#contato"
              onClick={() => {
                setOpen(false);
                trackEvent("click_header_cta", { location: "mobile" });
              }}
              className="mt-2 w-full"
            >
              Falar sobre meu projeto
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

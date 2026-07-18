import { useEffect, useRef, useState } from "react";
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Fecha o menu mobile por teclado, clique externo ou mudança para desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1200) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`header-enter fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--header-background)] shadow-[0_12px_36px_-28px_var(--shadow-color)] backdrop-blur-xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 md:h-[72px] md:px-8 min-[1200px]:gap-5">
        <a href="#inicio" className="shrink-0 whitespace-nowrap" aria-label="Ir para o início">
          <BarthyLogo />
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1200px]:flex" aria-label="Navegação principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] min-[1360px]:px-3"
              style={{ fontSize: "0.86rem" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <div className="hidden min-[1200px]:block">
            <LinkButton
              href="#contato"
              className="whitespace-nowrap"
              data-cta-source="header"
              onClick={() =>
                trackEvent("cta_click", { source: "header", destination: "contato" })
              }
            >
              Falar sobre meu projeto
            </LinkButton>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60 min-[1200px]:hidden"
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
        <div id="mobile-nav" className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-[var(--border)] bg-[var(--header-menu-background)] shadow-xl backdrop-blur-xl min-[1200px]:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Navegação mobile">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                {item.label}
              </a>
            ))}
            <LinkButton
              href="#contato"
              data-cta-source="mobile-menu"
              onClick={() => {
                setOpen(false);
                trackEvent("cta_click", {
                  source: "mobile-menu",
                  destination: "contato",
                });
              }}
              className="mt-2 w-full"
            >
              Falar sobre meu projeto
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

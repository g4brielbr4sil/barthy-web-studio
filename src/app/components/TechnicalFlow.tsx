const pnqcFlow = [
  "Autenticação",
  "Perfil",
  "Conteúdo",
  "Progresso",
  "Avaliação",
  "Certificação",
] as const;

export function TechnicalFlow() {
  return (
    <section aria-labelledby="technical-flow-title" className="technical-flow mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className="text-[var(--text-accent)]"
            style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Fluxo técnico
          </p>
          <h4 id="technical-flow-title" className="mt-2 text-[var(--foreground)]">
            Da autenticação à certificação
          </h4>
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted-foreground)]" style={{ fontSize: "0.7rem" }}>
          Representação visual
        </span>
      </div>

      <ol className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {pnqcFlow.map((step, index) => (
          <li
            key={step}
            className="technical-flow__step relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <span
              className="text-[var(--ice-blue)]"
              style={{ fontSize: "0.68rem", letterSpacing: "0.14em" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-[var(--foreground)]" style={{ fontSize: "0.82rem" }}>
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

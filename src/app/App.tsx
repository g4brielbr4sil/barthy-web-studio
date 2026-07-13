// Importado primeiro: o efeito de módulo aplica o tema salvo antes do
// primeiro paint (anti-flash). Não remover esta ordem.
import { ThemeProvider } from "./lib/theme";
import { SeoHead } from "./components/SeoHead";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { WhatWeOrganize } from "./components/WhatWeOrganize";
import { ForWhom } from "./components/ForWhom";
import { Solutions } from "./components/Solutions";
import { SystemsCRM } from "./components/SystemsCRM";
import { ProductsSystems } from "./components/ProductsSystems";
import { AppliedExperience } from "./components/AppliedExperience";
import { Pricing } from "./components/Pricing";
import { HowItWorks } from "./components/HowItWorks";
import { HermesSection } from "./components/HermesSection";
import { FAQ } from "./components/FAQ";
import { QuoteForm } from "./components/QuoteForm";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-clip">
        <SeoHead />
        <Header />
        <main>
          <Hero />
          <WhatWeOrganize />
          <ForWhom />
          <Solutions />
          <SystemsCRM />
          <ProductsSystems />
          <AppliedExperience />
          <Pricing />
          <HowItWorks />
          <HermesSection />
          <FAQ />
          <QuoteForm />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

import { useEffect } from "react";
import { siteConfig, faq, serviceTypes } from "../data/content";

const DESCRIPTION =
  "A Barthy Web Studio cria páginas, sistemas, CRMs, dashboards e automações para empresas e profissionais que precisam apresentar, captar e organizar melhor sua operação.";

/**
 * Os metadados essenciais ficam no index.html para estarem disponíveis antes
 * da inicialização do React. Este componente mantém apenas o JSON-LD.
 */
export function SeoHead() {
  useEffect(() => {
    // JSON-LD estruturado: Organization + ProfessionalService + WebSite
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteConfig.url}#organization`,
          name: siteConfig.name,
          url: siteConfig.url,
          email: siteConfig.email,
          description: DESCRIPTION,
        },
        {
          "@type": "ProfessionalService",
          "@id": `${siteConfig.url}#service`,
          name: siteConfig.name,
          url: siteConfig.url,
          email: siteConfig.email,
          description: DESCRIPTION,
          // Base operacional institucional, sem endereço físico inventado.
          areaServed: { "@type": "Country", name: "Brasil" },
          serviceType: serviceTypes,
          makesOffer: serviceTypes.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
        {
          "@type": "WebSite",
          "@id": `${siteConfig.url}#website`,
          name: siteConfig.name,
          url: siteConfig.url,
          inLanguage: "pt-BR",
          publisher: { "@id": `${siteConfig.url}#organization` },
        },
        {
          "@type": "FAQPage",
          "@id": `${siteConfig.url}#faq`,
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    };

    const scriptId = "barthy-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, []);

  return null;
}

export default SeoHead;

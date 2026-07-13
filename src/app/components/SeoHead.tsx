import { useEffect } from "react";
import { siteConfig, faq, serviceTypes } from "../data/content";

const TITLE = "Barthy Web Studio | Landing Pages, CRM, Dashboards e Automações";
const DESCRIPTION =
  "Landing pages, portfólios, CRMs, dashboards e automações que tornam sua apresentação mais clara, a captação mais simples e o atendimento mais organizado. Base em Brasília, com atendimento digital em todo o Brasil.";
const KEYWORDS =
  "landing page, portfólio online, CRM, pipeline comercial, dashboard, portal interno, automação, integração, suporte digital, presença digital, Barthy Web Studio, sites em Brasília, atendimento remoto Brasil";
const OG_TITLE = "Barthy Web Studio | Páginas, sistemas e automações";
const OG_DESCRIPTION =
  "Landing pages, portfólios, CRMs, dashboards e automações para sua empresa apresentar melhor, captar clientes e organizar o atendimento.";

// Favicon (monograma BWS em Terra Orange) embutido como data URI — funciona no preview.
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#CD765D"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="22" fill="#ffffff">BWS</text></svg>`;
const FAVICON_HREF = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, type?: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  if (type) el.setAttribute("type", type);
}

/**
 * Injeta SEO técnico completo no <head>. O projeto Figma Make gera o
 * entrypoint automaticamente e não expõe um index.html editável, então
 * as tags são inseridas em tempo de execução.
 */
export function SeoHead() {
  useEffect(() => {
    document.documentElement.lang = "pt-BR";
    document.title = TITLE;

    upsertMeta("name", "description", DESCRIPTION);
    upsertMeta("name", "keywords", KEYWORDS);
    upsertMeta("name", "author", siteConfig.name);
    upsertMeta("name", "robots", "index, follow");
    // Open Graph (WhatsApp, LinkedIn, redes sociais)
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", siteConfig.name);
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("property", "og:title", OG_TITLE);
    upsertMeta("property", "og:description", OG_DESCRIPTION);
    upsertMeta("property", "og:url", siteConfig.url);

    // Twitter Card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", OG_TITLE);
    upsertMeta("name", "twitter:description", OG_DESCRIPTION);

    // Canonical + favicon
    upsertLink("canonical", siteConfig.url);
    upsertLink("icon", FAVICON_HREF, "image/svg+xml");
    upsertLink("apple-touch-icon", FAVICON_HREF);
    // Servido a partir de /public no deploy.
    upsertLink("manifest", "/site.webmanifest");

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
          description: "Páginas, sistemas e operação digital para empresas e profissionais.",
        },
        {
          "@type": "ProfessionalService",
          "@id": `${siteConfig.url}#service`,
          name: siteConfig.name,
          url: siteConfig.url,
          email: siteConfig.email,
          description: "Páginas, sistemas e operação digital para empresas e profissionais.",
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

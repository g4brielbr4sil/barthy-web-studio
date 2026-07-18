import {
  LayoutDashboard,
  Globe,
  Database,
  Workflow,
  Wrench,
  GaugeCircle,
  Boxes,
  Network,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Configuração central do site                                       */
/*  Domínio placeholder — troque quando o domínio real for configurado. */
/*  WhatsApp/endpoint do Hermes vêm de variáveis de ambiente (ver libs).*/
/* ------------------------------------------------------------------ */
export const siteConfig = {
  name: "Barthy Web Studio",
  url: "https://barthywebstudio.com.br",
  domain: "barthywebstudio.com.br",
  email: "contato.barthywebstudio@gmail.com",
  baseCity: "Brasília/DF",
  // Preenchido apenas se você não usar VITE_BARTHY_WHATSAPP_URL.
  // Somente dígitos (DDI + DDD + número), ex.: "5561999999999".
  whatsapp: "" as string,
  instagram: "",
  linkedin: "",
} as const;

/** Monta um link mailto com assunto e corpo pré-preenchidos. */
export function mailtoUrl(subject: string, body: string): string {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * URL do WhatsApp da Barthy. Prioriza VITE_BARTHY_WHATSAPP_URL;
 * cai para siteConfig.whatsapp. Retorna "" se nada estiver configurado.
 */
export function barthyWhatsappUrl(message?: string): string {
  const envUrl = (import.meta.env.VITE_BARTHY_WHATSAPP_URL as string | undefined)?.trim();
  const fromNumber = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`
    : "";
  const base = envUrl || fromNumber;
  if (!base) return "";
  if (!message) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(message)}`;
}

/**
 * Link de contato preferencial: WhatsApp se configurado, senão e-mail.
 * Sempre retorna um link válido para os CTAs "falar com a Barthy".
 */
export function contactHref(
  message = "Olá, quero conversar sobre uma solução digital para organizar meu projeto ou operação com a Barthy Web Studio.",
): string {
  return barthyWhatsappUrl(message) || mailtoUrl("Contato — Barthy Web Studio", message);
}

/* ------------------------------------------------------------------ */
/*  Onde ajudamos — "O que organizamos" (pontos neutros e profissionais) */
/* ------------------------------------------------------------------ */
export const organizePoints: string[] = [
  "Informações espalhadas",
  "Atendimento sem continuidade",
  "Ferramentas desconectadas",
  "Falta de visão sobre a próxima ação",
];

export const organizeOutcomes: string[] = [
  "Presença mais clara",
  "Captação organizada",
  "Atendimento acompanhado",
  "Operação estruturada",
];

/* ------------------------------------------------------------------ */
/*  Para quem é a Barthy?                                              */
/* ------------------------------------------------------------------ */
export const audiencesIntro =
  "Para quem precisa apresentar melhor seus serviços, organizar o atendimento, conectar informações ou estruturar processos digitais com mais clareza.";

export const audiences: string[] = [
  "Empresas de eventos",
  "Prestadores de serviço",
  "Profissionais autônomos",
  "Empresas locais",
  "Operações em crescimento",
  "Empresas que vendem pelo WhatsApp",
  "Equipes comerciais",
  "Academias e estúdios",
  "Clínicas e serviços de cuidado",
  "Escolas, cursos e plataformas educacionais",
  "Operações que precisam organizar atendimento",
  "Empresas que precisam de CRM, dashboards ou portais",
  "Projetos que precisam de sistemas sob medida",
  "Operações que precisam conectar ferramentas",
];

/* ------------------------------------------------------------------ */
/*  Soluções (seção principal — id="solucoes")                        */
/* ------------------------------------------------------------------ */
export interface SolutionGroup {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

export const solutions: SolutionGroup[] = [
  {
    title: "Presença digital",
    description:
      "Apresentação clara, profissional e preparada para transformar visitas em contatos.",
    icon: Globe,
    items: [
      "Landing pages",
      "Portfólios profissionais",
      "Páginas institucionais",
      "Páginas para eventos e serviços",
      "Links profissionais",
    ],
  },
  {
    title: "Captação e atendimento",
    description:
      "Canais mais organizados para receber, registrar e acompanhar solicitações.",
    icon: Workflow,
    items: [
      "Formulários",
      "Páginas de orçamento",
      "Organização de mensagens",
      "Estrutura de contato",
      "Encaminhamento de oportunidades",
    ],
  },
  {
    title: "Organização comercial",
    description:
      "Mais clareza sobre quem entrou, em que etapa está e o que precisa acontecer depois.",
    icon: Database,
    items: [
      "Propostas",
      "Pipeline",
      "Acompanhamento",
      "Organização de leads",
      "Próximas ações",
    ],
  },
  {
    title: "Suporte e estrutura digital",
    description:
      "Uma base mais segura e organizada para a operação funcionar.",
    icon: Wrench,
    items: [
      "Organização de contas",
      "Ferramentas e arquivos",
      "Configurações",
      "Suporte técnico",
      "Orientação digital",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Produtos e sistemas digitais (catálogo ampliado)                  */
/* ------------------------------------------------------------------ */
export interface DigitalProduct {
  title: string;
  text: string;
  icon: LucideIcon;
  items: string[];
  note?: string;
}

export const digitalProducts: DigitalProduct[] = [
  {
    title: "SaaS e plataformas digitais",
    icon: Boxes,
    text: "Produtos digitais reutilizáveis ou sob medida, com acesso organizado e funções alinhadas à operação.",
    note: "Escopo e arquitetura definidos após diagnóstico.",
    items: [
      "SaaS",
      "Plataformas com login",
      "Perfis de usuário",
      "Gestão de planos",
      "Produtos digitais",
    ],
  },
  {
    title: "Templates operacionais",
    icon: LayoutDashboard,
    text: "Estruturas reutilizáveis para padronizar comunicação, registros e rotinas sem começar cada processo do zero.",
    items: [
      "Propostas e orçamentos",
      "Follow-up",
      "Mensagens e e-mails",
      "Formulários",
      "Documentos internos",
    ],
  },
  {
    title: "Bots e Powerbot",
    icon: Workflow,
    text: "Fluxos de triagem e mensageria para coletar informações, registrar solicitações e direcionar contatos.",
    note: "Implementação após avaliação técnica, conforme disponibilidade da plataforma e conectores autorizados.",
    items: [
      "Menus de opções",
      "Triagem inicial",
      "Registro de leads",
      "Mensagens de confirmação",
      "Encaminhamento para equipe",
    ],
  },
  {
    title: "Formulários e integrações",
    icon: Network,
    text: "Conexões entre canais e ferramentas para reduzir tarefas manuais e manter a continuidade das informações.",
    note: "Integrações usam APIs oficiais e conectores compatíveis, conforme disponibilidade técnica.",
    items: [
      "Formulários conectados",
      "WhatsApp",
      "Gmail",
      "Telegram",
      "Ferramentas compatíveis",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sistemas e operação (seção de maior valor — 6 frentes)            */
/* ------------------------------------------------------------------ */
export interface SystemFront {
  title: string;
  text: string;
  icon: LucideIcon;
}

export const systemFronts: SystemFront[] = [
  {
    title: "CRM e pipeline comercial",
    text: "Organize leads, histórico, estágio, responsável e próxima ação.",
    icon: Database,
  },
  {
    title: "Dashboards e indicadores",
    text: "Acompanhe pedidos, tarefas, indicadores e status em uma visão centralizada.",
    icon: GaugeCircle,
  },
  {
    title: "Portais e áreas internas",
    text: "Centralize cadastros, documentos, solicitações e fluxos de atendimento.",
    icon: Boxes,
  },
  {
    title: "Cadastros e acompanhamento",
    text: "Estruture dados, históricos, responsáveis e status para acompanhar a operação com clareza.",
    icon: LayoutDashboard,
  },
  {
    title: "Filas, solicitações e tarefas",
    text: "Distribua demandas por prioridade, responsável, prazo e status de resolução.",
    icon: Network,
  },
  {
    title: "Sistemas sob medida",
    text: "Desenvolva uma solução alinhada às regras e necessidades específicas da operação.",
    icon: Wrench,
  },
];

/* ------------------------------------------------------------------ */
/*  Pacotes                                                            */
/* ------------------------------------------------------------------ */
export interface Pkg {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export const packages: Pkg[] = [
  {
    name: "Presença Básica",
    price: "R$ 297 – 497",
    tagline: "Para organizar a apresentação e o contato em uma estrutura profissional.",
    cta: "Escolher este pacote",
    features: [
      "Link profissional",
      "Bio e apresentação",
      "Botão de contato",
      "Formulário simples de orçamento",
      "Mensagem inicial de atendimento",
      "Organização básica dos serviços",
    ],
  },
  {
    name: "Portfólio Profissional",
    price: "R$ 697 – 997",
    tagline: "Para apresentar serviços, fotos e diferenciais e receber pedidos de orçamento.",
    highlight: true,
    cta: "Escolher este pacote",
    features: [
      "Página profissional",
      "Apresentação da marca",
      "Serviços e diferenciais",
      "Fotos e materiais",
      "Botão de contato",
      "Formulário de orçamento",
      "Texto comercial profissional",
      "Proposta comercial em PDF",
    ],
  },
  {
    name: "Comercial Completo",
    price: "R$ 1.197 – 1.997",
    tagline: "Para reunir página, proposta, formulário e atendimento em uma estrutura comercial.",
    cta: "Escolher este pacote",
    features: [
      "Portfólio online profissional",
      "Proposta comercial em PDF",
      "Formulário de captação",
      "Mensagens comerciais prontas",
      "Organização visual",
      "Funil simples de atendimento",
      "Checklist comercial",
      "Suporte técnico inicial simples, se necessário",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Como trabalhamos (processo unificado)                             */
/* ------------------------------------------------------------------ */
export const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    text: "Entendemos o contexto, a necessidade e o que precisa ser organizado.",
  },
  {
    n: "02",
    title: "Direção",
    text: "Definimos a solução adequada, o escopo, o prazo e as responsabilidades.",
  },
  {
    n: "03",
    title: "Construção",
    text: "Desenvolvemos a solução com acompanhamento e validações.",
  },
  {
    n: "04",
    title: "Entrega",
    text: "Entregamos a estrutura pronta para uso, com as orientações e os materiais definidos.",
  },
  {
    n: "05",
    title: "Continuidade",
    text: "Avaliamos próximos passos, ajustes e possibilidades de evolução.",
  },
];

/** O que fica definido antes de começar. */
export const definedBeforeStart: string[] = [
  "Escopo",
  "Prazo",
  "Investimento",
  "Entregáveis",
  "Forma de pagamento",
  "Canais de acompanhamento",
];

/* ------------------------------------------------------------------ */
/*  Hermes — operação interna                                         */
/* ------------------------------------------------------------------ */
export interface HermesFunction {
  title: string;
  text: string;
}

// A integração automática do formulário será ativada junto com a API pública de leads do Hermes.
export const hermesFunctions: HermesFunction[] = [
  {
    title: "Centraliza",
    text: "Reúne dados de contato, origem e solução de interesse.",
  },
  {
    title: "Classifica",
    text: "Organiza cada oportunidade por cidade, serviço, prioridade e estágio.",
  },
  {
    title: "Notifica",
    text: "Cria alertas e sinaliza quando existe uma nova solicitação ou ação pendente.",
  },
  {
    title: "Direciona",
    text: "Ajuda a definir a próxima ação, como diagnóstico, proposta ou follow-up.",
  },
  {
    title: "Acompanha",
    text: "Mantém status, histórico e andamento comercial registrados.",
  },
];

/* ------------------------------------------------------------------ */
/*  Experiência aplicada                                              */
/* ------------------------------------------------------------------ */
export interface Experience {
  title: string;
  category: string;
  description: string;
  accent: string;
  link?: { label: string; url: string };
}

export const appliedExperience: Experience[] = [
  {
    title: "Grupo Levens",
    category: "Ecossistema digital",
    description:
      "Experiência aplicada em portais, integrações, atendimento e processos operacionais voltados ao setor de cuidados.",
    accent: "from-[#4A7FA7] to-[#1A3D63]",
    link: {
      label: "Ver matéria na PEGN",
      url: "https://revistapegn.globo.com/conteudo-de-marca/pulse-brand/noticia/2026/07/grupo-levens-lanca-ecossistema-para-profissionalizar-empresas-de-cuidados-no-brasil-1.ghtml",
    },
  },
  {
    title: "PNQC",
    category: "Plataforma educacional",
    description:
      "Plataforma educacional com autenticação, trilhas, progresso, avaliações e certificação.",
    accent: "from-[#CD765D] to-[#1A3D63]",
  },
  {
    title: "Hermes",
    category: "CRM e operação interna",
    description:
      "Sistema interno de CRM, rotina, financeiro, acompanhamento e organização comercial.",
    accent: "from-[#B3CFE5] to-[#1A3D63]",
  },
  {
    title: "Portais e fluxos internos",
    category: "Operações estruturadas",
    description:
      "Experiência com cadastros, dashboards, permissões, processos e acompanhamento de operações.",
    accent: "from-[#4A7FA7] to-[#0A1931]",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ (usado também no JSON-LD FAQPage)                              */
/* ------------------------------------------------------------------ */
export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "A Barthy cria apenas sites?",
    a: "Não. A Barthy também estrutura CRM, dashboards, portais, sistemas sob medida, produtos digitais, integrações e fluxos para organizar atendimento e operação.",
  },
  {
    q: "É possível contratar um sistema sob medida?",
    a: "Sim. O projeto começa com um diagnóstico para entender regras, usuários, informações e prioridades antes da definição do escopo.",
  },
  {
    q: "Como funciona o diagnóstico?",
    a: "A Barthy entende o contexto, o problema, a operação atual e a prioridade. A partir disso, indica uma solução adequada e apresenta escopo, prazo, investimento e responsabilidades.",
  },
  {
    q: "Os pacotes incluem domínio e hospedagem?",
    a: "Domínio, hospedagem e serviços de terceiros são definidos conforme o projeto e descritos na proposta. Quando houver custos externos, eles são apresentados antes do início.",
  },
  {
    q: "A Barthy trabalha com automações e integrações?",
    a: "Sim, após avaliação técnica. As integrações dependem da disponibilidade da plataforma, de APIs oficiais, de conectores compatíveis e das autorizações necessárias.",
  },
  {
    q: "É possível começar com uma solução menor?",
    a: "Sim. Um pacote ou uma entrega pontual pode criar uma base inicial. Depois, os próximos passos são avaliados conforme a necessidade e o momento da operação.",
  },
  {
    q: "Como funcionam pagamento e início do projeto?",
    a: "O formato padrão é 50% no início e 50% na entrega. O projeto começa após a aprovação da proposta, a confirmação do pagamento inicial e o recebimento dos materiais combinados.",
  },
  {
    q: "A Barthy atende fora de Brasília?",
    a: "Sim. A Barthy tem base em Brasília e realiza atendimento digital em todo o Brasil.",
  },
  {
    q: "O que acontece depois da entrega?",
    a: "A solução é entregue pronta para uso, acompanhada das orientações e dos materiais previstos no escopo. Ajustes, suporte adicional e novas evoluções podem ser avaliados em uma próxima etapa.",
  },
];

/* ------------------------------------------------------------------ */
/*  Formulário — tipos de solução                                     */
/* ------------------------------------------------------------------ */
export const serviceOptions: string[] = [
  "Landing page ou portfólio",
  "Página para eventos ou serviços",
  "CRM e gestão comercial",
  "Dashboard ou painel interno",
  "Sistema sob medida",
  "SaaS ou plataforma digital",
  "Portal ou área interna",
  "Automação de atendimento",
  "Integração com WhatsApp ou canais",
  "Fila e gestão de solicitações",
  "Template ou estrutura reutilizável",
  "Sistema para academia",
  "Sistema para bar ou restaurante",
  "Sistema para eventos",
  "Suporte e organização digital",
  "Pacote Presença Básica",
  "Pacote Portfólio Profissional",
  "Pacote Comercial Completo",
  "Outra solução digital",
  "Ainda não sei qual solução",
];

/* Tipos de serviço para o structured data (serviceType). */
export const serviceTypes: string[] = [
  "Landing pages",
  "Portfólios online",
  "Páginas para eventos e serviços",
  "CRM e organização comercial",
  "Dashboards e portais internos",
  "Automações e integrações",
  "Sistemas sob medida",
  "Suporte e operação digital",
];

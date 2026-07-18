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
/*  Frentes de atuação — camada inicial curta                          */
/* ------------------------------------------------------------------ */
export interface ServiceFront {
  title: string;
  description: string;
  examples: string[];
  icon: LucideIcon;
}

export const serviceFronts: ServiceFront[] = [
  {
    title: "Presença digital",
    description: "Páginas e portfólios que apresentam a empresa com clareza.",
    examples: ["Landing pages", "Portfólios", "Páginas institucionais"],
    icon: Globe,
  },
  {
    title: "Operação comercial",
    description: "Formulários, propostas e acompanhamento de oportunidades.",
    examples: ["Captação", "Propostas", "Follow-up"],
    icon: Workflow,
  },
  {
    title: "Sistemas e integrações",
    description: "Dashboards, portais e fluxos construídos conforme a operação.",
    examples: ["CRM", "Áreas internas", "Integrações"],
    icon: Network,
  },
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
  benefit: string;
  icon: LucideIcon;
  items: string[];
}

export const solutions: SolutionGroup[] = [
  {
    title: "Landing pages e portfólios",
    description:
      "Página focada em apresentar uma empresa, serviço ou profissional.",
    benefit: "Direciona o visitante para contato ou orçamento.",
    icon: Globe,
    items: [
      "Apresentação profissional",
      "CTA e formulário",
    ],
  },
  {
    title: "Páginas institucionais e de eventos",
    description: "Página para explicar serviços, programação ou diferenciais.",
    benefit: "Concentra informações e canais de contato.",
    icon: Workflow,
    items: [
      "Conteúdo organizado",
      "Agenda ou serviços",
    ],
  },
  {
    title: "Formulários e captação",
    description: "Formulários para receber pedidos e dados relevantes.",
    benefit: "Melhora o início do atendimento.",
    icon: Database,
    items: [
      "Campos sob medida",
      "Encaminhamento",
    ],
  },
  {
    title: "Estrutura comercial digital",
    description: "Materiais para apresentar, propor e acompanhar oportunidades.",
    benefit: "Mantém a comunicação comercial consistente.",
    icon: Wrench,
    items: [
      "Propostas",
      "Mensagens comerciais",
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
  details: string[];
  note?: string;
}

export const digitalProducts: DigitalProduct[] = [
  {
    title: "SaaS e plataformas digitais",
    icon: Boxes,
    text: "Produtos com acesso, perfis e funções próprias para uma necessidade recorrente.",
    note: "Escopo e arquitetura definidos após diagnóstico.",
    items: ["SaaS", "Plataformas com login", "Perfis de usuário"],
    details: [
      "Autenticação e permissões",
      "Dados e regras de negócio",
      "Painéis e jornadas por perfil",
    ],
  },
  {
    title: "Templates e estruturas reutilizáveis",
    icon: LayoutDashboard,
    text: "Bases prontas para padronizar rotinas e acelerar novas entregas.",
    items: ["Propostas", "Follow-up", "Documentos internos"],
    details: [
      "Campos e etapas adaptáveis",
      "Padrões de comunicação",
      "Reaproveitamento entre operações semelhantes",
    ],
  },
  {
    title: "Bots e automações",
    icon: Workflow,
    text: "Fluxos para coletar dados, registrar solicitações e direcionar contatos.",
    note: "Implementação após avaliação técnica, conforme disponibilidade da plataforma e conectores autorizados.",
    items: ["Triagem", "Confirmações", "Encaminhamento"],
    details: [
      "Gatilhos e regras de direcionamento",
      "Registro de eventos importantes",
      "Integração com canais compatíveis",
    ],
  },
  {
    title: "Integrações e formulários conectados",
    icon: Network,
    text: "Conexões entre canais e ferramentas para reduzir tarefas manuais.",
    note: "Integrações usam APIs oficiais e conectores compatíveis, conforme disponibilidade técnica.",
    items: ["Formulários conectados", "APIs", "Canais compatíveis"],
    details: [
      "Envio e recebimento de dados",
      "Validação e tratamento de erros",
      "Rastreio do fluxo entre ferramentas",
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
    text: "Registre contatos, negociações e próximas ações.",
    icon: Database,
  },
  {
    title: "Dashboards e indicadores",
    text: "Acompanhe indicadores, tarefas e status em uma visão.",
    icon: GaugeCircle,
  },
  {
    title: "Portais e áreas internas",
    text: "Centralize cadastros, documentos e solicitações.",
    icon: Boxes,
  },
  {
    title: "Cadastros e acompanhamento",
    text: "Mantenha dados, históricos e responsáveis acessíveis.",
    icon: LayoutDashboard,
  },
  {
    title: "Filas, solicitações e tarefas",
    text: "Distribua demandas por prioridade, prazo e responsável.",
    icon: Network,
  },
  {
    title: "Sistemas sob medida",
    text: "Aplique regras específicas em uma solução própria.",
    icon: Wrench,
  },
];

export const systemDetails = {
  howItWorks:
    "As informações entram por formulários ou cadastros, seguem etapas definidas e ficam disponíveis para consulta e acompanhamento.",
  flows: [
    "Contato → qualificação → proposta → próxima ação",
    "Solicitação → responsável → prazo → conclusão",
    "Cadastro → validação → histórico → indicador",
  ],
  technologies: [
    "React e TypeScript no frontend",
    "APIs e banco de dados conforme o projeto",
    "Autenticação, permissões e deploy quando necessários",
  ],
  note:
    "A arquitetura é definida depois do diagnóstico, considerando usuários, volume de dados, integrações e regras de negócio.",
} as const;

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
      "Apresentação e serviços",
      "Botão de contato",
      "Formulário simples de orçamento",
    ],
  },
  {
    name: "Portfólio Profissional",
    price: "R$ 697 – 997",
    tagline: "Para apresentar serviços, fotos e diferenciais e receber pedidos de orçamento.",
    highlight: true,
    cta: "Escolher este pacote",
    features: [
      "Página profissional responsiva",
      "Marca, serviços e diferenciais",
      "Galeria de fotos e materiais",
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
      "Fluxo inicial de atendimento",
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
    text: "Entendemos a necessidade, o contexto e as prioridades.",
  },
  {
    n: "02",
    title: "Direção",
    text: "Definimos caminho, escopo, prazo e responsabilidades.",
  },
  {
    n: "03",
    title: "Construção",
    text: "Desenvolvemos com acompanhamento e validações.",
  },
  {
    n: "04",
    title: "Entrega",
    text: "Disponibilizamos a estrutura pronta para uso.",
  },
  {
    n: "05",
    title: "Continuidade",
    text: "Avaliamos suporte, ajustes e próximos passos.",
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
  summary: string;
  result: string;
  badges: string[];
  details: {
    howItWorks: string;
    architecture: string;
    role: string[];
    challenges: string[];
    deployment: string;
    businessRules: string[];
  };
  context?: string;
  accent: string;
  link?: { label: string; url: string };
}

export const appliedExperience: Experience[] = [
  {
    title: "Levens",
    category: "Experiência profissional aplicada",
    summary:
      "Ecossistema digital com portais, integrações e fluxos operacionais para o setor de cuidados.",
    result: "Conecta portais por perfil, cadastros, documentos e rotinas.",
    badges: ["React", "TypeScript", "Supabase", "APIs", "n8n", "Iugu"],
    details: {
      howItWorks:
        "Portais por perfil concentram cadastros, documentos, vagas, escalas, avaliações e atividades operacionais.",
      architecture:
        "Aplicações web conectadas a autenticação, banco relacional, serviços externos e automações conforme cada módulo.",
      role: [
        "Desenvolvimento e manutenção de portais",
        "Integrações e automações",
        "Governança de TI",
        "Validação de regras de negócio",
      ],
      challenges: [
        "Permissões diferentes por perfil",
        "Continuidade entre atendimento e operação",
        "Integrações financeiras e documentos",
      ],
      deployment: "Ambientes web e serviços operacionais definidos por módulo.",
      businessRules: [
        "Perfis e permissões",
        "Vagas, escalas e avaliações",
        "Validação de cadastros e documentos",
      ],
    },
    context:
      "A experiência envolve atuação profissional colaborativa e não é apresentada como criação exclusiva da Barthy.",
    accent: "from-[#4A7FA7] to-[#1A3D63]",
    link: {
      label: "Ver matéria na PEGN",
      url: "https://revistapegn.globo.com/conteudo-de-marca/pulse-brand/noticia/2026/07/grupo-levens-lanca-ecossistema-para-profissionalizar-empresas-de-cuidados-no-brasil-1.ghtml",
    },
  },
  {
    title: "PNQC",
    category: "Plataforma educacional",
    summary:
      "Plataforma de formação e certificação profissional com cursos, progresso e avaliações.",
    result: "Controla acesso, avanço, avaliações e aprovação por módulo.",
    badges: ["React", "TypeScript", "Vite", "Supabase", "PostgreSQL", "RLS", "Cloudflare Pages"],
    details: {
      howItWorks:
        "Usuários autenticados acessam módulos e aulas, registram progresso e realizam avaliações dentro das regras da plataforma.",
      architecture:
        "Frontend React e Vite conectado ao Supabase Auth, PostgreSQL e políticas RLS, com rotas protegidas e deploy no Cloudflare Pages.",
      role: [
        "Frontend e componentes",
        "Autenticação e perfis",
        "Modelagem e regras de progresso",
        "Validação e deploy",
      ],
      challenges: [
        "Progresso sequencial",
        "Persistência de avaliações",
        "Proteção de dados por perfil",
      ],
      deployment: "Frontend no Cloudflare Pages com serviços de dados no Supabase.",
      businessRules: [
        "Rotas protegidas",
        "Conclusão sequencial de conteúdo",
        "Critérios de aprovação e certificação",
      ],
    },
    accent: "from-[#CD765D] to-[#1A3D63]",
  },
  {
    title: "Hermes",
    category: "CRM e operação interna",
    summary:
      "Sistema interno para organizar CRM, tarefas, rotina, financeiro e acompanhamento comercial.",
    result: "Centraliza oportunidades, tarefas e próximas ações.",
    badges: ["React", "Vite", "FastAPI", "SQLite", "Docker", "API REST"],
    details: {
      howItWorks:
        "Contatos e atividades são registrados, classificados e acompanhados por etapas e próximas ações.",
      architecture:
        "Frontend React e Vite consumindo uma API REST em FastAPI, com persistência em SQLite e execução em Docker.",
      role: [
        "Arquitetura",
        "Frontend e backend",
        "APIs e modelagem",
        "Deploy e integração de módulos",
      ],
      challenges: [
        "Unificar módulos em uma operação coerente",
        "Manter histórico e estados confiáveis",
        "Transformar rotinas reais em fluxos digitais",
      ],
      deployment: "Aplicação conteinerizada para operação em ambiente próprio.",
      businessRules: [
        "Classificação de contatos",
        "Etapas e próximas ações",
        "Tarefas, prioridades e acompanhamento",
      ],
    },
    context:
      "O Hermes é apresentado como sistema interno full stack, não como inteligência artificial autônoma.",
    accent: "from-[#B3CFE5] to-[#1A3D63]",
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
    a: "Não. Também desenvolvemos CRM, dashboards, portais, integrações e sistemas sob medida.",
  },
  {
    q: "É possível contratar um sistema sob medida?",
    a: "Sim. Primeiro entendemos usuários, dados, regras e prioridades. Depois definimos escopo, prazo e arquitetura.",
  },
  {
    q: "Como funciona o diagnóstico?",
    a: "Entendemos o contexto, a prioridade e o processo atual. A proposta apresenta solução, escopo, prazo, investimento e responsabilidades.",
  },
  {
    q: "Os pacotes incluem domínio e hospedagem?",
    a: "Esses serviços são definidos na proposta. Qualquer custo externo é informado antes do início.",
  },
  {
    q: "A Barthy trabalha com automações e integrações?",
    a: "Sim, após avaliação técnica. Usamos APIs oficiais e conectores compatíveis com as autorizações necessárias.",
  },
  {
    q: "É possível começar com uma solução menor?",
    a: "Sim. Um pacote ou entrega pontual pode criar a base inicial. Novas etapas são avaliadas depois.",
  },
  {
    q: "Como funcionam pagamento e início do projeto?",
    a: "O formato padrão é 50% no início e 50% na entrega. O trabalho começa após aprovação, pagamento inicial e recebimento dos materiais combinados.",
  },
  {
    q: "A Barthy atende fora de Brasília?",
    a: "Sim. A base é Brasília e o atendimento digital alcança todo o Brasil.",
  },
  {
    q: "O que acontece depois da entrega?",
    a: "A entrega inclui as orientações previstas no escopo. Suporte, ajustes e novas etapas podem ser avaliados separadamente.",
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

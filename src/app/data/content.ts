import {
  LayoutDashboard,
  Globe,
  Database,
  Workflow,
  Wrench,
  PartyPopper,
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
  message = "Olá, tenho interesse em organizar a presença digital do meu negócio com a Barthy Web Studio.",
): string {
  return barthyWhatsappUrl(message) || mailtoUrl("Contato — Barthy Web Studio", message);
}

/* ------------------------------------------------------------------ */
/*  Onde ajudamos — "O que organizamos" (pontos neutros e profissionais) */
/* ------------------------------------------------------------------ */
export const organizePoints: string[] = [
  "Informações espalhadas entre site, Instagram e WhatsApp",
  "Orçamentos e propostas sem um padrão definido",
  "Leads sem histórico ou próxima ação",
  "Atendimento dependente de tarefas manuais",
  "Falta de visibilidade sobre pedidos, tarefas e status",
  "Ferramentas, arquivos e acessos sem uma organização central",
  "Processos internos que dependem de planilhas e mensagens soltas",
  "Falta de uma página clara para apresentar serviços e diferenciais",
];

/* ------------------------------------------------------------------ */
/*  Para quem é a Barthy?                                              */
/* ------------------------------------------------------------------ */
export const audiencesIntro =
  "Para empresas, profissionais e operações que precisam apresentar melhor seus serviços, organizar o atendimento, captar oportunidades ou estruturar processos digitais.";

export const audiences: string[] = [
  "Empresas de eventos",
  "Buffets e serviços para festas",
  "Bares, restaurantes e experiências",
  "Prestadores de serviço",
  "Profissionais autônomos",
  "Empresas locais",
  "Negócios que vendem pelo WhatsApp",
  "Empresas que precisam organizar propostas e atendimento",
  "Operações que precisam de CRM, dashboard ou painel interno",
  "Academias e estúdios",
  "Clínicas e serviços de cuidado",
  "Escolas, cursos e plataformas educacionais",
  "Empresas com equipes comerciais",
  "Empresas que precisam organizar filas, solicitações e tarefas",
  "Operações que precisam de automações e integrações",
  "Negócios que precisam de software sob medida",
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
    title: "Landing pages e portfólios",
    description:
      "Apresente serviços, diferenciais e canais de contato em uma página clara, profissional e preparada para captar oportunidades.",
    icon: Globe,
    items: [
      "Landing page",
      "Portfólio profissional",
      "Página institucional",
      "Página para campanhas",
      "Página para prestadores de serviço",
    ],
  },
  {
    title: "Páginas para eventos e experiências",
    description:
      "Organize fotos, formatos, serviços, cardápios, agenda, diferenciais e pedidos de orçamento em uma estrutura profissional.",
    icon: PartyPopper,
    items: [
      "Empresas de eventos",
      "Buffets",
      "Bares e experiências",
      "Produções",
      "Serviços para festas",
    ],
  },
  {
    title: "Captação e organização comercial",
    description:
      "Facilite o primeiro contato e apresente sua oferta com materiais claros, prontos para apoiar conversas e pedidos de orçamento.",
    icon: Workflow,
    items: [
      "Formulário de orçamento",
      "Proposta comercial",
      "Mensagens comerciais",
      "Organização de WhatsApp",
      "Link profissional",
    ],
  },
  {
    title: "Suporte e operação digital",
    description:
      "Organize ferramentas, arquivos, acessos, backups e configurações técnicas para manter a rotina funcionando com mais segurança.",
    icon: Wrench,
    items: [
      "Gmail e Google Drive",
      "Organização de arquivos",
      "Backup",
      "Configuração de ferramentas",
      "Suporte remoto",
      "Instalação e otimização",
      "Impressoras e periféricos",
    ],
  },
];

/** Complementos comerciais — apoio, não os serviços principais. */
export const complements: string[] = [
  "Proposta comercial",
  "Formulário de orçamento",
  "Organização de WhatsApp",
  "Mensagens comerciais",
  "Link profissional",
  "Bio e apresentação",
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
    text: "Produtos digitais acessados pela internet, com login, perfis de usuário, dados organizados e funcionalidades específicas para cada operação.",
    note: "Projetos sob medida, com escopo definido após diagnóstico.",
    items: [
      "SaaS para empresas",
      "Plataformas de assinatura",
      "Sistemas multiusuário",
      "Gestão de planos",
      "Controle de acesso",
    ],
  },
  {
    title: "Canais de comunicação conectados",
    icon: Workflow,
    text: "Conecte canais de contato a fluxos de triagem, registro e encaminhamento.",
    note: "Integrações conforme disponibilidade técnica, termos de uso e autorização do cliente.",
    items: [
      "WhatsApp",
      "E-mail",
      "Formulários",
      "Telegram",
      "Registro automático de contatos",
      "Alertas internos",
      "Respostas iniciais",
      "Distribuição para atendentes",
    ],
  },
  {
    title: "Bots e triagem 24/7",
    icon: GaugeCircle,
    text: "Estruturas de atendimento automático podem responder perguntas iniciais, coletar informações e registrar solicitações a qualquer hora.",
    note: "O atendimento automático faz a triagem e o registro; a equipe assume quando necessário.",
    items: [
      "Perguntas frequentes",
      "Coleta de nome e contato",
      "Identificação do serviço de interesse",
      "Registro no CRM",
      "Direcionamento para atendente",
      "Informações de horário",
      "Solicitação de orçamento",
      "Triagem inicial",
    ],
  },
  {
    title: "Powerbot e integrações de mensageria",
    icon: Network,
    text: "Powerbot e outras soluções de mensageria podem ser integradas a fluxos de atendimento, CRM, alertas e registro de solicitações.",
    note: "Integrações realizadas com APIs oficiais e conectores autorizados para cada canal.",
    items: [
      "Atendimento automatizado",
      "Menus de opções",
      "Triagem",
      "Registro de leads",
      "Encaminhamento para equipe",
      "Mensagens de confirmação",
      "Lembretes",
      "Atualizações de status",
      "Integração com n8n",
      "Integração com sistemas internos",
    ],
  },
  {
    title: "Templates e estruturas reutilizáveis",
    icon: Boxes,
    text: "Estruturas reutilizáveis para padronizar a comunicação e reduzir retrabalho.",
    items: [
      "Templates de proposta",
      "Templates de orçamento",
      "Templates de atendimento",
      "Templates de follow-up",
      "Templates de mensagens",
      "Templates de e-mail",
      "Templates de landing page",
      "Templates de formulários",
      "Templates de documentos internos",
    ],
  },
  {
    title: "Integrações e conectores",
    icon: Network,
    text: "Conecte ferramentas que hoje trabalham separadas com APIs oficiais e acessos autorizados.",
    items: [
      "Hermes",
      "n8n",
      "Google Sheets",
      "Gmail",
      "Google Drive",
      "Formulários",
      "APIs externas",
      "Bancos de dados",
      "Supabase",
      "Sistemas de pagamento",
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
    title: "CRM e pipeline",
    text: "Organize leads, histórico, estágio, responsável e próxima ação.",
    icon: Database,
  },
  {
    title: "Dashboards operacionais",
    text: "Acompanhe pedidos, tarefas, indicadores e status em uma visão centralizada.",
    icon: GaugeCircle,
  },
  {
    title: "Portais e áreas internas",
    text: "Centralize cadastros, documentos, solicitações e fluxos de atendimento.",
    icon: Boxes,
  },
  {
    title: "Filas e solicitações",
    text: "Distribua demandas por prioridade, responsável, prazo e status de resolução.",
    icon: Network,
  },
  {
    title: "Cadastros e operação interna",
    text: "Estruture dados, rotinas e permissões para manter a equipe trabalhando com clareza.",
    icon: LayoutDashboard,
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
    text: "Entendemos o objetivo, a operação atual, o público e os pontos que precisam evoluir.",
  },
  {
    n: "02",
    title: "Proposta",
    text: "Definimos escopo, entregas, prazo, investimento e responsabilidades de cada parte.",
  },
  {
    n: "03",
    title: "Produção",
    text: "Desenvolvemos a solução, validamos o conteúdo e acompanhamos as decisões do projeto.",
  },
  {
    n: "04",
    title: "Entrega e evolução",
    text: "Publicamos, documentamos e indicamos os próximos passos para manter ou evoluir a estrutura.",
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
    category: "Portais e operação digital",
    description:
      "Atuação profissional em portais, fluxos internos, governança, testes e evolução de produtos digitais dentro do ecossistema Levens.",
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
      "Estrutura de plataforma com módulos, aulas, autenticação, progresso, avaliações, certificados e diferentes perfis de acesso.",
    accent: "from-[#CD765D] to-[#1A3D63]",
  },
  {
    title: "Hermes Command Center",
    category: "CRM e operação interna",
    description:
      "Sistema próprio para organizar leads, pipeline comercial, financeiro, tarefas, rotina, relatórios e acompanhamento da operação.",
    accent: "from-[#B3CFE5] to-[#1A3D63]",
  },
  {
    title: "Portais, CRM e automações",
    category: "Sistemas sob medida",
    description:
      "Experiência com dashboards, formulários, cadastros, fluxos operacionais, integrações, testes e organização de processos digitais.",
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
    q: "Quanto custa uma landing page?",
    a: "O investimento depende do conteúdo, quantidade de seções, integrações e prazo. Os pacotes da Barthy apresentam pontos de partida, e o valor final é confirmado após entender a necessidade.",
  },
  {
    q: "A Barthy cria portfólios para empresas de eventos?",
    a: "Sim. A página pode reunir serviços, fotos, formatos de atendimento, diferenciais, informações comerciais e formulário de orçamento.",
  },
  {
    q: "A Barthy desenvolve CRM ou painel interno?",
    a: "Sim. Podemos desenvolver CRMs, dashboards, portais e áreas internas para organizar leads, solicitações, tarefas, cadastros e processos.",
  },
  {
    q: "Vocês fazem automações e integrações?",
    a: "Sim. Desenvolvemos automações para registrar solicitações, enviar alertas, conectar formulários, e-mail, planilhas e sistemas.",
  },
  {
    q: "Preciso ter logo, fotos e textos prontos?",
    a: "Não. Avaliamos o que já existe, organizamos os materiais e indicamos o que precisa ser produzido antes do desenvolvimento.",
  },
  {
    q: "Vocês também oferecem suporte técnico?",
    a: "Sim. Atendemos necessidades relacionadas a ferramentas, arquivos, contas, backup, instalação, otimização e suporte remoto.",
  },
  {
    q: "A Barthy atende fora de Brasília?",
    a: "Sim. A Barthy tem base em Brasília, com atendimento digital em todo o Brasil.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "O formato padrão é 50% no início e 50% na entrega. Condições específicas são apresentadas na proposta.",
  },
  {
    q: "Qual é o prazo de entrega?",
    a: "O prazo depende do escopo, das integrações e do envio dos materiais. A previsão é definida na proposta antes do início.",
  },
  {
    q: "Qual pacote é mais adequado?",
    a: "A escolha depende do objetivo atual. O formulário ajuda a entender a necessidade e indicar entre um pacote existente ou uma solução sob medida.",
  },
  {
    q: "O que é o Hermes?",
    a: "É o sistema interno usado pela Barthy para organizar contatos, serviços de interesse, histórico e próximas ações comerciais.",
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

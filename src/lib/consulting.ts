export type ConsultingPackage = {
  id: string;
  name: string;
  price: number;
  highlight?: boolean;
  description: string;
  includes: string[];
  timeline: string;
};

export const consultingPackages: ConsultingPackage[] = [
  {
    id: "consultoria-start",
    name: "Start",
    price: 149.9,
    description: "Diagnóstico técnico para organizar prioridades e destravar seu servidor.",
    includes: ["Call de 60 minutos", "Checklist de performance", "Plano de ação", "Indicação de scripts"],
    timeline: "Entrega em até 24h úteis"
  },
  {
    id: "consultoria-pro",
    name: "Pro",
    price: 349.9,
    highlight: true,
    description: "Acompanhamento prático para instalação, ajustes e organização do ecossistema.",
    includes: ["2 calls estratégicas", "Revisão de recursos", "Ajustes guiados", "Suporte por 7 dias"],
    timeline: "Agenda combinada após pagamento"
  },
  {
    id: "consultoria-elite",
    name: "Elite",
    price: 799.9,
    description: "Consultoria premium para servidores que querem estrutura profissional de loja e operação.",
    includes: ["Roadmap completo", "Setup de monetização", "Arquitetura de scripts", "Suporte por 15 dias"],
    timeline: "Onboarding em até 48h úteis"
  }
];

export function getConsultingPackage(id: string) {
  return consultingPackages.find((item) => item.id === id);
}

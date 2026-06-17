export type CatalogItem = {
  id: string;
  name: string;
  category: "script" | "bundle" | "automation";
  price: number;
  oldPrice?: number;
  badge: string;
  description: string;
  features: string[];
  delivery: string;
};

export const catalogItems: CatalogItem[] = [
  {
    id: "vip-core",
    name: "VIP Core FiveM",
    category: "script",
    price: 79.9,
    oldPrice: 119.9,
    badge: "Mais vendido",
    description: "Sistema VIP completo com grupos, tempo de licença, logs e integração Discord.",
    features: ["Licença vitalícia", "Painel de permissões", "Logs de ativação", "Suporte de instalação"],
    delivery: "Entrega digital após confirmação do Pix"
  },
  {
    id: "garages-pro",
    name: "Garages Pro",
    category: "script",
    price: 59.9,
    badge: "Premium",
    description: "Garagem moderna para FiveM com UI responsiva, favoritos e suporte a múltiplos tipos.",
    features: ["UI dark premium", "Favoritos", "Impound integrado", "Configuração simples"],
    delivery: "Entrega digital após confirmação do Pix"
  },
  {
    id: "shop-creator",
    name: "Shop Creator",
    category: "automation",
    price: 89.9,
    badge: "Automação",
    description: "Crie lojas, categorias e itens no servidor com configuração limpa e escalável.",
    features: ["Categorias ilimitadas", "Compatível com inventários", "Logs Discord", "Código organizado"],
    delivery: "Entrega digital após confirmação do Pix"
  },
  {
    id: "manjiro-pack",
    name: "Manjiro Pack Inicial",
    category: "bundle",
    price: 149.9,
    oldPrice: 249.9,
    badge: "Combo",
    description: "Pacote com scripts essenciais para iniciar ou modernizar uma cidade FiveM.",
    features: ["3 scripts premium", "Atualizações inclusas", "Instalação guiada", "Garantia de qualidade"],
    delivery: "Entrega digital após confirmação do Pix"
  }
];

export function getCatalogItem(id: string) {
  return catalogItems.find((item) => item.id === id);
}

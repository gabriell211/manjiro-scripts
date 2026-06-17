import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  LockKeyhole,
  Rocket,
  Shield,
  Sparkles,
  Zap
} from "lucide-react";
import { ConsultingSection } from "@/components/ConsultingSection";
import { ProductCard } from "@/components/ProductCard";
import { catalogItems } from "@/lib/catalog";

const stats = [
  { label: "clientes e operadores", value: "1.000+" },
  { label: "suporte técnico", value: "24/7" },
  { label: "scripts premium", value: "50+" }
];

const benefits = [
  {
    icon: Shield,
    title: "Entrega segura",
    text: "Pagamento Pix via Mercado Pago e fluxo preparado para liberação digital."
  },
  {
    icon: Headphones,
    title: "Suporte de verdade",
    text: "Acompanhamento profissional para instalação, dúvidas e ajustes essenciais."
  },
  {
    icon: Zap,
    title: "Performance primeiro",
    text: "Scripts pensados para servidores FiveM organizados, rápidos e fáceis de manter."
  }
];

const faq = [
  {
    question: "Como recebo meu script?",
    answer: "Após o Pix ser aprovado, a equipe pode liberar o arquivo, documentação e suporte pelo canal oficial."
  },
  {
    question: "O pagamento é automático?",
    answer: "A geração do Pix é feita pela API do Mercado Pago. A entrega pode ser automatizada ou validada pela equipe."
  },
  {
    question: "Preciso ter conta para comprar?",
    answer: "O login Google ajuda a organizar pedidos e suporte, mas o checkout também coleta nome e e-mail."
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />
        <div className="hero__content">
          <span className="hero-badge">
            <Sparkles size={16} />
            Loja oficial Manjiro Scripts
          </span>
          <h1>Scripts FiveM premium para cidades que querem parecer grandes desde o primeiro login.</h1>
          <p>
            Loja profissional com carrinho, login Google, consultoria e Pix Mercado Pago para vender
            scripts, pacotes e serviços de forma rápida e confiável.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="#loja">
              Ver scripts
              <ArrowRight size={18} />
            </Link>
            <Link className="button button--ghost" href="#consultoria">
              Pacotes de consultoria
            </Link>
          </div>
          <div className="hero__stats">
            {stats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-panel">
          <div className="terminal-card">
            <div className="terminal-card__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="terminal-card__body">
              <p>
                <span>$</span> manjiro install premium-pack
              </p>
              <p className="success">✓ licença validada</p>
              <p className="success">✓ pagamento Pix disponível</p>
              <p className="success">✓ suporte profissional ativo</p>
            </div>
          </div>
          <div className="floating-card">
            <Rocket size={22} />
            <strong>Setup rápido</strong>
            <span>scripts, bundles e consultoria no mesmo checkout</span>
          </div>
        </div>
      </section>

      <section className="section" id="loja">
        <div className="section-heading">
          <span className="eyebrow">Loja</span>
          <h2>Catálogo premium para turbinar seu servidor.</h2>
          <p>Escolha os scripts, adicione ao carrinho e finalize com Pix em poucos cliques.</p>
        </div>
        <div className="product-grid">
          {catalogItems.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <ConsultingSection />

      <section className="section benefits" id="beneficios">
        <div className="section-heading">
          <span className="eyebrow">Garantias</span>
          <h2>Um fluxo pensado para vender com confiança.</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((item) => (
            <article className="benefit-card" key={item.title}>
              <item.icon size={24} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <div>
          <span className="eyebrow">Pronto para vender</span>
          <h2>Checkout com Pix, login Google e carrinho já encaixados.</h2>
          <p>Agora é configurar as variáveis de ambiente, subir o deploy e conectar sua operação.</p>
        </div>
        <Link className="button button--primary" href="/checkout">
          Ir para checkout
          <LockKeyhole size={18} />
        </Link>
      </section>

      <section className="section faq" id="faq">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Perguntas rápidas antes do Pix.</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>
                <BadgeCheck size={18} />
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

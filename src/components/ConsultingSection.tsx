"use client";

import { CalendarCheck, Plus, Sparkles } from "lucide-react";
import { consultingPackages } from "@/lib/consulting";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

export function ConsultingSection() {
  const { addItem } = useCart();

  return (
    <section className="section section--consulting" id="consultoria">
      <div className="section-heading">
        <span className="eyebrow">Consultoria</span>
        <h2>Pacotes para sua cidade rodar mais bonita, estável e lucrativa.</h2>
        <p>
          Escolha o nível de acompanhamento ideal. Após o Pix, a equipe agenda o onboarding e
          organiza os próximos passos.
        </p>
      </div>

      <div className="consulting-grid">
        {consultingPackages.map((item) => (
          <article
            className={`consulting-card ${item.highlight ? "consulting-card--highlight" : ""}`}
            key={item.id}
          >
            {item.highlight ? (
              <span className="consulting-card__ribbon">
                <Sparkles size={15} />
                Recomendado
              </span>
            ) : null}
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <strong>{formatCurrency(item.price)}</strong>
            <ul>
              {item.includes.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <span className="timeline">
              <CalendarCheck size={16} />
              {item.timeline}
            </span>
            <button
              className="button button--primary button--full"
              onClick={() =>
                addItem({
                  id: item.id,
                  type: "consulting",
                  name: `Consultoria ${item.name}`,
                  price: item.price
                })
              }
            >
              <Plus size={17} />
              Adicionar pacote
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

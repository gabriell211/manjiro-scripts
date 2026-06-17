"use client";

import { Check, Plus } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

export function ProductCard({ item }: { item: CatalogItem }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <div className="product-card__top">
        <span className="product-badge">{item.badge}</span>
        <span className="product-category">{item.category}</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <ul>
        {item.features.map((feature) => (
          <li key={feature}>
            <Check size={16} />
            {feature}
          </li>
        ))}
      </ul>
      <div className="price-row">
        <div>
          {item.oldPrice ? <small>{formatCurrency(item.oldPrice)}</small> : null}
          <strong>{formatCurrency(item.price)}</strong>
        </div>
        <button
          className="button button--primary"
          onClick={() =>
            addItem({
              id: item.id,
              type: "product",
              name: item.name,
              price: item.price
            })
          }
        >
          <Plus size={17} />
          Comprar
        </button>
      </div>
      <span className="delivery-note">{item.delivery}</span>
    </article>
  );
}

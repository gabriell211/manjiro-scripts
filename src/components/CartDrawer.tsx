"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/format";

export function CartDrawer() {
  const { closeCart, isOpen, items, removeItem, subtotal, totalItems, updateQuantity } = useCart();

  return (
    <>
      <button
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop--visible" : ""}`}
        onClick={closeCart}
        aria-label="Fechar carrinho"
      />
      <aside className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`} aria-live="polite">
        <div className="cart-drawer__header">
          <div>
            <span className="eyebrow">Carrinho</span>
            <h2>{totalItems} item(ns)</h2>
          </div>
          <button className="icon-button" onClick={closeCart} aria-label="Fechar carrinho">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={44} />
            <h3>Seu carrinho está esperando o primeiro script.</h3>
            <p>Escolha um produto ou pacote de consultoria para gerar pagamento via Pix.</p>
          </div>
        ) : (
          <div className="cart-drawer__items">
            {items.map((item) => (
              <article className="cart-line" key={`${item.type}-${item.id}`}>
                <div>
                  <span>{item.type === "consulting" ? "Consultoria" : "Script"}</span>
                  <strong>{item.name}</strong>
                  <small>{formatCurrency(item.price)}</small>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                    aria-label={`Diminuir quantidade de ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                    aria-label={`Aumentar quantidade de ${item.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="cart-line__remove"
                  onClick={() => removeItem(item.id, item.type)}
                  aria-label={`Remover ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="cart-drawer__footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <Link
            className={`button button--primary button--full ${items.length === 0 ? "button--disabled" : ""}`}
            href="/checkout"
            onClick={closeCart}
          >
            Finalizar com Pix
          </Link>
        </div>
      </aside>
    </>
  );
}

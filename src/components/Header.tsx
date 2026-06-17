"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Menu, ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { data: session, status } = useSession();
  const { openCart, totalItems } = useCart();

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <div className="brand-mark" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="Manjiro Scripts" width={42} height={42} style={{ borderRadius: 14 }} />
        </div>
        <span>
          <strong>Manjiro Scripts</strong>
          <small>FiveM premium store</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Principal">
        <Link href="/#loja">Loja</Link>
        <Link href="/#consultoria">Consultoria</Link>
        <Link href="/#beneficios">Garantias</Link>
        <Link href="/#faq">FAQ</Link>
      </nav>

      <div className="header-actions">
        {status === "authenticated" ? (
          <>
            <Link className="button button--ghost" href="/dashboard">
              Minha Área
            </Link>
            <button className="profile-pill" onClick={() => signOut()} title="Sair da conta">
              {session.user?.image ? (
                <span
                  className="profile-avatar"
                  style={{ backgroundImage: `url(${session.user.image})` }}
                />
              ) : (
                <UserRound size={18} />
              )}
              <span>{session.user?.name?.split(" ")[0] ?? "Conta"}</span>
            </button>
          </>
        ) : (
          <Link className="button button--ghost" href="/login">
            Entrar com Google
          </Link>
        )}
        <button className="cart-button" onClick={openCart} aria-label="Abrir carrinho">
          <ShoppingCart size={18} />
          <span>{totalItems}</span>
        </button>
        <button className="mobile-menu" aria-label="Abrir menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

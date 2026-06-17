"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

export function LoginPanel() {
  const { status } = useSession();
  const [providers, setProviders] = useState<ProviderMap>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const googleProvider = providers?.google;

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark brand-mark--large" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="Manjiro Scripts" width={76} height={76} style={{ borderRadius: 24 }} />
        </div>
        <span className="eyebrow">Área do cliente</span>
        <h1>Entre ou cadastre-se com Google</h1>
        <p>
          Use sua conta Google para agilizar pedidos, consultar compras e receber suporte da Manjiro
          Scripts.
        </p>

        {status === "authenticated" ? (
          <Link className="button button--primary button--full" href="/dashboard">
            Acessar área do cliente
          </Link>
        ) : googleProvider ? (
          <button
            className="google-button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <span>G</span>
            Continuar com Google
          </button>
        ) : (
          <div className="setup-warning">
            <ShieldCheck size={22} />
            <div>
              <strong>Google OAuth ainda não configurado</strong>
              <p>
                Preencha <code>GOOGLE_CLIENT_ID</code> e <code>GOOGLE_CLIENT_SECRET</code> no
                ambiente para liberar login/cadastro.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

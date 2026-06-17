"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Copy, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/format";

type PixResponse = {
  id: number;
  status: string;
  statusDetail?: string;
  amount: number;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
};

type PaymentStatus = {
  status: string;
  statusDetail?: string;
  approvedAt?: string;
};

export function CheckoutClient() {
  const { clearCart, items, subtotal } = useCart();
  const { data: session } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<PixResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const nameValue = name ?? session?.user?.name ?? "";
  const emailValue = email ?? session?.user?.email ?? "";

  const payloadItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        type: item.type,
        quantity: item.quantity
      })),
    [items]
  );

  async function createPix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payer: { name: nameValue, email: emailValue },
          items: payloadItems
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao gerar Pix.");
      }

      setPix(data);
      setPaymentStatus({ status: data.status, statusDetail: data.statusDetail });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Erro ao gerar Pix.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPixCode() {
    if (!pix?.qrCode) {
      return;
    }

    await navigator.clipboard.writeText(pix.qrCode);
    setCopied(true);
  }

  async function refreshPaymentStatus() {
    if (!pix?.id) {
      return;
    }

    const response = await fetch(`/api/payments/${pix.id}`);
    const data = await response.json();

    if (response.ok) {
      setPaymentStatus(data);

      if (data.status === "approved") {
        clearCart();
      }
    }
  }

  if (items.length === 0 && !pix) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <QrCode size={48} />
          <h1>Seu carrinho está vazio.</h1>
          <p>Volte para a loja, escolha seus scripts e gere o Pix em poucos cliques.</p>
          <Link className="button button--primary" href="/#loja">
            Ver loja
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-shell">
        <div className="checkout-summary">
          <span className="eyebrow">Pagamento seguro</span>
          <h1>Finalize seu pedido via Pix</h1>
          <p>
            O pagamento é gerado pelo Mercado Pago. Após aprovação, sua entrega digital ou
            consultoria pode ser liberada pela equipe.
          </p>

          <div className="summary-list">
            {items.map((item) => (
              <div className="summary-line" key={`${item.type}-${item.id}`}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatCurrency(pix?.amount ?? subtotal)}</strong>
          </div>

          <div className="trust-box">
            <ShieldCheck size={20} />
            <span>Token do Mercado Pago usado apenas no servidor.</span>
          </div>
        </div>

        <div className="payment-card">
          {!pix ? (
            <form onSubmit={createPix}>
              <label>
                Nome completo
                <input value={nameValue} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                E-mail para entrega
                <input
                  type="email"
                  value={emailValue}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              {error ? <div className="form-error">{error}</div> : null}
              <button className="button button--primary button--full" disabled={loading}>
                {loading ? <Loader2 className="spin" size={18} /> : <QrCode size={18} />}
                Gerar Pix
              </button>
            </form>
          ) : (
            <div className="pix-box">
              <span className="eyebrow">Pix gerado</span>
              <h2>Escaneie ou copie o código</h2>
              {pix.qrCodeBase64 ? (
                <Image
                  className="pix-qr"
                  src={`data:image/png;base64,${pix.qrCodeBase64}`}
                  alt="QR Code Pix"
                  width={270}
                  height={270}
                  unoptimized
                />
              ) : null}
              {pix.qrCode ? (
                <>
                  <textarea readOnly value={pix.qrCode} />
                  <button className="button button--ghost button--full" onClick={copyPixCode}>
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? "Código copiado" : "Copiar Pix copia e cola"}
                  </button>
                </>
              ) : null}
              <button className="button button--primary button--full" onClick={refreshPaymentStatus}>
                Verificar pagamento
              </button>
              {paymentStatus ? (
                <p className="status-pill">
                  Status: <strong>{paymentStatus.status}</strong>
                  {paymentStatus.statusDetail ? ` (${paymentStatus.statusDetail})` : ""}
                </p>
              ) : null}
              {pix.ticketUrl ? (
                <a className="ticket-link" href={pix.ticketUrl} target="_blank" rel="noreferrer">
                  Abrir comprovante no Mercado Pago
                </a>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

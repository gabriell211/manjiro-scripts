import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { purchases: { orderBy: { createdAt: "desc" } } }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={64}
              height={64}
              style={{ borderRadius: "50%" }}
            />
          )}
          <div>
            <h1 style={{ fontSize: "28px", margin: 0 }}>
              Olá, {user.name || "Cliente"}!
            </h1>
            <p style={{ color: "#666", margin: "4px 0 0" }}>
              {user.email}
            </p>
          </div>
        </div>
        <Link href="/" style={{ textDecoration: "none", color: "#0070f3", fontWeight: "500" }}>
          Voltar para loja
        </Link>
      </div>

      <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Meus Scripts e Compras</h2>

      {user.purchases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
          <p style={{ fontSize: "18px", color: "#666" }}>Você ainda não tem compras.</p>
          <Link href="/" style={{ display: "inline-block", marginTop: "20px", padding: "12px 24px", backgroundColor: "#0070f3", color: "white", borderRadius: "8px", textDecoration: "none" }}>
            Começar a comprar
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {user.purchases.map((purchase) => (
            <div
              key={purchase.id}
              style={{
                border: "1px solid #eaeaea",
                borderRadius: "12px",
                padding: "24px",
                backgroundColor: "white"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Compra #{purchase.mercadoPagoId}
                  </p>
                  <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                    {new Date(purchase.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <span
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    backgroundColor: purchase.status === "approved" ? "#d4edda" : "#fff3cd",
                    color: purchase.status === "approved" ? "#155724" : "#856404"
                  }}
                >
                  {purchase.status === "approved" ? "Aprovado" : purchase.status}
                </span>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
                  {(purchase.items as any[]).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: "500" }}>{item.name}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#666" }}>
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <span style={{ fontWeight: "600" }}>
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                    Total: {formatCurrency(purchase.amount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

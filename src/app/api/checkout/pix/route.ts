import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { catalogItems, getCatalogItem } from "@/lib/catalog";
import { consultingPackages, getConsultingPackage } from "@/lib/consulting";
import { getMercadoPagoPaymentClient } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const checkoutSchema = z.object({
  payer: z.object({
    name: z.string().min(2, "Informe seu nome."),
    email: z.string().email("Informe um e-mail válido.")
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["product", "consulting"]),
        quantity: z.number().int().min(1).max(20)
      })
    )
    .min(1, "Adicione pelo menos um item ao carrinho.")
});

function resolveCheckoutItem(input: z.infer<typeof checkoutSchema>["items"][number]) {
  const item =
    input.type === "product" ? getCatalogItem(input.id) : getConsultingPackage(input.id);

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    quantity: input.quantity,
    unitPrice: item.price,
    total: item.price * input.quantity
  };
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const items = parsed.data.items.map(resolveCheckoutItem);

  if (items.some((item) => item === null)) {
    return NextResponse.json({ error: "Um ou mais itens do carrinho são inválidos." }, { status: 400 });
  }

  const resolvedItems = items.filter(Boolean) as NonNullable<(typeof items)[number]>[];
  const transactionAmount = Number(
    resolvedItems.reduce((total, item) => total + item.total, 0).toFixed(2)
  );

  if (transactionAmount <= 0) {
    return NextResponse.json({ error: "Valor do pedido inválido." }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    let userId = null;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (user) {
        userId = user.id;
      }
    }

    const payment = getMercadoPagoPaymentClient();
    const [firstName, ...lastNameParts] = parsed.data.payer.name.trim().split(/\s+/);

    const response = await payment.create({
      body: {
        transaction_amount: transactionAmount,
        description: `Manjiro Scripts - ${resolvedItems.map((item) => item.name).join(", ")}`,
        payment_method_id: "pix",
        payer: {
          email: parsed.data.payer.email,
          first_name: firstName,
          last_name: lastNameParts.join(" ")
        },
        external_reference: `manjiro-${Date.now()}`,
        metadata: {
          store: "manjiro-scripts",
          items: resolvedItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice
          }))
        }
      }
    });

    await prisma.purchase.create({
      data: {
        mercadoPagoId: String(response.id),
        status: response.status || "pending",
        amount: transactionAmount,
        items: resolvedItems,
        userId: userId,
        approvedAt: response.date_approved ? new Date(response.date_approved) : null
      }
    });

    const transactionData = response.point_of_interaction?.transaction_data;

    return NextResponse.json({
      id: response.id,
      status: response.status,
      statusDetail: response.status_detail,
      amount: transactionAmount,
      qrCode: transactionData?.qr_code,
      qrCodeBase64: transactionData?.qr_code_base64,
      ticketUrl: transactionData?.ticket_url,
      items: resolvedItems
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível gerar o Pix.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    products: catalogItems.length,
    consultingPackages: consultingPackages.length,
    mercadoPagoPublicKeyConfigured: Boolean(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY),
    mercadoPagoAccessTokenConfigured: Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN)
  });
}

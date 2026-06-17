import { NextRequest, NextResponse } from "next/server";
import { getMercadoPagoPaymentClient } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID do pagamento não informado." }, { status: 400 });
  }

  try {
    const payment = getMercadoPagoPaymentClient();
    const response = await payment.get({ id });

    await prisma.purchase.upsert({
      where: { mercadoPagoId: id },
      update: {
        status: response.status || "pending",
        approvedAt: response.date_approved ? new Date(response.date_approved) : null
      },
      create: {
        mercadoPagoId: id,
        status: response.status || "pending",
        amount: response.transaction_amount || 0,
        items: [],
        userId: null,
        approvedAt: response.date_approved ? new Date(response.date_approved) : null
      }
    });

    return NextResponse.json({
      id: response.id,
      status: response.status,
      statusDetail: response.status_detail,
      amount: response.transaction_amount,
      approvedAt: response.date_approved
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível consultar o pagamento.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

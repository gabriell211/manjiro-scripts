import { NextRequest, NextResponse } from "next/server";
import { getMercadoPagoPaymentClient } from "@/lib/mercadopago";

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

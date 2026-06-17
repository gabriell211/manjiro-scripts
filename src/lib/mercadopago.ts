import { MercadoPagoConfig, Payment } from "mercadopago";

export function getMercadoPagoPaymentClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 8000
    }
  });

  return new Payment(client);
}

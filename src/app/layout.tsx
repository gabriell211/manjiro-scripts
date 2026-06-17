import type { Metadata } from "next";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { SplashScreen } from "@/components/SplashScreen";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manjiro Scripts | Loja premium FiveM",
  description:
    "Loja premium de scripts FiveM com carrinho, login Google, consultoria e pagamento Pix via Mercado Pago.",
  keywords: ["FiveM", "scripts", "Manjiro Scripts", "Mercado Pago", "Pix", "consultoria"],
  openGraph: {
    title: "Manjiro Scripts",
    description: "Scripts FiveM premium, suporte profissional e pagamento via Pix.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <SplashScreen />
          <Header />
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

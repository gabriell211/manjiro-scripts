# Manjiro Scripts

Loja profissional para venda de scripts FiveM com splashscreen, catálogo, carrinho, login/cadastro com Google, pacotes de consultoria e checkout Pix via Mercado Pago.

## Funcionalidades

- Landing page premium com splashscreen animada.
- Catálogo de scripts e bundles.
- Carrinho persistente no navegador.
- Checkout Pix com QR Code e código copia-e-cola via Mercado Pago.
- Consulta de status do pagamento.
- Login/cadastro com Google usando NextAuth.
- Aba de consultoria com pacotes, preços e inclusão no carrinho.
- Layout responsivo para desktop e mobile.

## Tecnologias

- Next.js App Router
- React + TypeScript
- NextAuth
- Mercado Pago SDK
- ESLint flat config

## Configuração local

Crie um arquivo `.env.local` a partir do exemplo:

```bash
cp .env.example .env.local
```

Preencha:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-um-segredo-forte

GOOGLE_CLIENT_ID=client-id-do-google
GOOGLE_CLIENT_SECRET=client-secret-do-google

NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=public-key-do-mercado-pago
MERCADO_PAGO_ACCESS_TOKEN=access-token-do-mercado-pago
```

> Nunca faça commit do `MERCADO_PAGO_ACCESS_TOKEN`. Ele é usado apenas nas rotas server-side.

## Rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validar

```bash
npm run lint
npm run build
```

## Deploy

Configure as mesmas variáveis de ambiente na plataforma de hospedagem. Para Google OAuth, cadastre a URL de callback:

```text
https://seu-dominio.com/api/auth/callback/google
```

Para localhost:

```text
http://localhost:3000/api/auth/callback/google
```

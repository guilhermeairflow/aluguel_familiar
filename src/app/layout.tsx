import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Aluguel Familiar – Casas de Temporada Premium',
  description: 'Descubra propriedades excepcionais para famílias e grupos. Guarujá, Ilhabela, Campos do Jordão, Riviera e muito mais.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para Google Fonts antes do CSS bloquear */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Carregar fonte de forma não-bloqueante */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}

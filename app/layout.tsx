// app/layout.tsx
import Script from "next/script";

export const metadata = {
  title: "Mi sitio",
  description: "Descripción de tu sitio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Carga Tailwind desde CDN antes de render */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}

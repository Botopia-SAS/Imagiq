// app/layout.tsx

import Script from "next/script";

export const metadata = {
  title: "ImagiQ",
  description: "Proveedor oficial de Samsung en Colombia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Tailwind CSS a través de CDN */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />

        {/* model-viewer para AR/VR (WebXR) */}
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}

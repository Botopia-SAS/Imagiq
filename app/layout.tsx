export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Carga Tailwind desde CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}

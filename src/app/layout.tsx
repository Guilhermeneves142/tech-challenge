import "@/styles/globals.css";
import "@/styles/typography.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

import "@/styles/globals.css";
import "@/styles/typography.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=add_2,bolt,credit_card,home,local_mall,qr_code,sync_alt,trending_up&display=block"
        />
      </head>
      <body className="min-h-screen bg-background pt-[88px] lg:pt-0">
        {children}
        {/* </aside> */}
      </body>
    </html>
  );
}

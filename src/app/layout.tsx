import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { MfeEventListener } from "@/components/mfe/MfeEventListener";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={roboto.variable}>
      <body className="min-h-screen bg-background">
        <MfeEventListener />
        {children}
      </body>
    </html>
  );
}

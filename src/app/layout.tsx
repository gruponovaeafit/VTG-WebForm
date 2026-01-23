import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./styles/globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Formulario VTG",
  description: "Aplicación personalizada hecha por el Grupo NOVA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // OJO: Ponemos overflow: hidden para que NO se pueda scrollear
    <html lang="es" style={{ overflow: "hidden" }}>
      <head>
        <link rel="icon" href="/NOVA.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

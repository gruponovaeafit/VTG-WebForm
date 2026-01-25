import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";

// Google font optimizada con next/font
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
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
        <link rel="icon" href="/FifaBall.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Preload de fuentes críticas para mejorar LCP */}
        <link
          rel="preload"
          href="/fonts/EASPORTS.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
        <ToastContainer />
        <SpeedInsights />
      </body>
    </html>
  );
}

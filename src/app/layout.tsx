import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/NOVA.ico" /> 
      </head>
      <body
        className={`${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

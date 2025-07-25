"use client";

import EmailForm from "../globalcomponents/Forms/Form-EmailAssessment";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/coins.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col gap-8 items-center text-center">
        <h1 className="text-2xl md:text-3xl mb-6 pixel-font text-white">
          ¡Bienvenidx al Formulario VTG!
        </h1>

        {/* Formulario de email */}
        <EmailForm />

        <Footer />

      </main>

    </div>
  );
}
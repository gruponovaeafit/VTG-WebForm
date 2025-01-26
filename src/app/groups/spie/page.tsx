"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import SpieForm from "../../globalcomponents/Forms/Form-Spie";
import InfoSPIE from "@/app/globalcomponents/Info/Info-SPIE";

export default function Home() {
  return (
    <div
      className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/spie.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center gap-8 text-center w-full max-w-2xl mt-8 sm:mt-16">
        <h1 className="text-5xl md:text-6xl font-bold pixel-font text-white glitch_Spie">
          SPIE
        </h1>

        {/* Información de SPIE */}
        <InfoSPIE />

        {/* Formulario SPIE */}
        <SpieForm />
      </main>
    </div>
  );
}

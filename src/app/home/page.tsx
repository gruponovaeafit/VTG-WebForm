"use client";

import PersonalForm from "../globalcomponents/Forms/Form-Personal";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import Footer from "../globalcomponents/UI/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col justify-between w-full h-screen bg-black text-white overflow-hidden"
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
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-2xl md:text-3xl mb-4 pixel-font text-white-300">
          ¡Formulario Personal!
        </h1>
        <PersonalForm />

        <Footer />

      </main>



    </div>
  );
}

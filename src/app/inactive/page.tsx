"use client";

import { useRouter } from "next/navigation";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import Footer from "../globalcomponents/UI/Footer_NOVA_negro";

export default function MainPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/email");
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-screen overflow-hidden">
      {/* Fondo que ocupa toda la pantalla */}

      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-6 md:mb-8 pixel-font text-white leading-tight">
            ¡Te esperamos el próximo semestre!
          </h1>
        </div>
        
        <Footer />

      </div>
      
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import PixelsAnimation from "./globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import Footer from "./globalcomponents/UI/Footer";

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
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow">
        <h1 className="text-2xl md:text-3xl mb-6 pixel-font text-white">
            Te esperamos el proximo semestre!
          </h1>

        <Footer />

      </div>
      
    </div>
  );
}



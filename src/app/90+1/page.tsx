"use client";

import Button from "@/app/globalcomponents/UI/Button";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer_NOVA_blanco from "../globalcomponents/UI/Footer_NOVA_blanco";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();
  const isVerified = useAuthCheck();

  useEffect(() => {
    document.body.classList.add("no-scroll");

    // Mostrar el botón después de 3 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(timer);
    };
  }, []);

  if (!isVerified) return null;

  const handleRestart = () => {
    router.push("/"); // Redirige a la ruta "/"
  };

  return (
    <div className="relative flex flex-col justify-between items-center w-full min-h-screen overflow-hidden px-4 sm:px-6 md:px-8">
      {/* Fondo que ocupa toda la pantalla */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/Loading.svg')" }}
      ></div>

      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow w-full py-8 sm:py-12 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-4 sm:mb-6 font-ea text-white px-4">
          pitazo final
        </h1>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-4 sm:mb-6 font-ea text-white px-4">
          bienvenidx a la familia
        </h1>

        {showButton && (
          <Button
            onClick={handleRestart}
            variant="verde"
            size="md"
            state="active"
            theme="fifa"
            className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
            textShadow={false}
          >
            Volver al inicio
          </Button>
        )}
      </div>

      <div className="relative z-20 w-full flex justify-center items-center pb-4 sm:pb-6 md:pb-10">
        <Footer_NOVA_blanco/>
      </div>
    </div>
  );
}

"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import Button from "@/app/globalcomponents/UI/Button";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("no-scroll");

    // Mostrar el botón después de 5 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    };
  }, []);

  const handleRestart = () => {
    router.push("/"); // Redirige a la ruta "/"
  };

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-screen overflow-hidden">
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
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow">
        <h1 className="text-4xl md:text-5xl text-center mb-6 font-ea text-white">
          Gracias por participar
        </h1>

        {showButton && (
          <Button
            onClick={handleRestart}
            variant="verde"
            size="md"
            state="active"
            theme="fifa"
            className="mt-6"
            textShadow={false}
          >
            Volver al inicio
          </Button>
        )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 justify-center items-center z-20">
        <Footer />
      </div>
    </div>
  );
}

"use client";

import GroupsForm from "../globalcomponents/Forms/Form-Groups";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Elimina el scroll de la página
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden"
      style={{
        backgroundImage: "url('/coins.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center text-center p-8 sm:p-20 w-[90%] max-w-lg gap-8">
        <h1 className="text-2xl md:text-4xl font-bold pixel-font text-yellow-300">
          ¡Escoge el grupo de tu preferencia!
        </h1>

        {/* Formulario arcade */}
        <GroupsForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

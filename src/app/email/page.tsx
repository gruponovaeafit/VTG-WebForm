"use client";

import EmailForm from "../globalcomponents/Forms/Form-Email";
import ConfettiAnimation from "../globalcomponents/UI/ConfettiAnimation";
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
        backgroundImage: "url('/main.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-ea text-white-300">
            ¡Bienvenidos
          </h1>
          <h1 className="text-5xl font-ea text-white-300">
            al Formulario VTG!
          </h1>
        </div>
        <div className="-mt-5">
          {/* Formulario de email */}
          <EmailForm />
        </div>

        <Footer />

      </main>

    </div>
  );
}


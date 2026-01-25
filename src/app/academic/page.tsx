"use client";

import AcademicForm from "../globalcomponents/Forms/Form-Academic";
import { useEffect } from "react";
import Footer_NOVA_blanco from "@/app/globalcomponents/UI/Footer_NOVA_blanco";
import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

export default function Home() {
  const isVerified = useAuthCheck();
  
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  if (!isVerified) return null;

  return (
    <div
      className="relative flex items-center justify-center w-full h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/main.svg')",
        backgroundSize: "cover",
        position: "relative",

      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal más pequeño y centrado */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-ea text-white-300">
            Informacion
          </h1>
          <h1 className="text-5xl font-ea text-white-300">
            Academica
          </h1>
        </div>
        <div className="mt-5">
          <AcademicForm />
        </div>

        <Footer_NOVA_blanco />

      </main>

      

    </div>
  );
}

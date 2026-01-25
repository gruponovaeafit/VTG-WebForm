"use client";

import GroupsForm from "../globalcomponents/Forms/Form-Groups";
import { useEffect } from "react";
import ConfettiAnimation from "../globalcomponents/UI/ConfettiAnimation";
import Footer_NOVA_blanco from "../globalcomponents/UI/Footer_NOVA_blanco";
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
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 bg-black text-white"
      style={{
        backgroundImage: "url('/main.svg')",
        backgroundSize: "cover",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animación de confeti */}
      <div style={{ pointerEvents: "none" }}>
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center row-start-2">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-ea text-white-300">Escoge</h1>
          <h1 className="text-5xl font-ea text-white-300">Tu grupo</h1>
        </div>
        {/* Formulario arcade */}
        <GroupsForm />
        <Footer_NOVA_blanco />

      </main>

    </div>
  );
}

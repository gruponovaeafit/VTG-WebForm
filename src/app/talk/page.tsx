"use client";

import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import Footer_NOVA_blanco from "../globalcomponents/UI/Footer_NOVA_blanco";
import { useEffect } from "react";
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
    <div className="relative flex flex-col justify-between items-center w-full min-h-screen overflow-hidden px-4 sm:px-6 md:px-8 bg-[#5C4BD1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(88,44,138,0.45),_transparent_60%)]" />
      <img
        src="/NOVA_ManchaTop.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 z-0 w-[220px] h-auto
         sm:w-[760px] 
         md:w-[600px]"
      />
      <img
        src="/NOVA_ManchaBottom.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 z-0 w-[280px] h-auto
        sm:w-[620px]
        md:w-[700px]"
      />

      <div className="absolute inset-0 pointer-events-none z-10">
        <ConfettiAnimation />
      </div>

      <div className="relative z-20 flex flex-col justify-center items-center flex-grow w-full py-8 sm:py-12 md:py-16 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/40 border-2 border-black/40 px-4 py-1 text-white text-xs sm:text-sm font-bold tracking-wide">
          ⚽️ ÚLTIMA OPORTUNIDAD
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl text-center mb-2 font-ea text-white px-4 drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">
          Tiempo extra
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-center mb-6 text-white/90 px-4 max-w-xl">
          ¡Todavía estás a tiempo! Aquí tienes la información clave para tu assessment.
        </p>

        <div className="w-full max-w-lg rounded-3xl bg-black/35 border-4 border-black/40 text-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-center mb-4 font-ea text-white">
            Fechas del assessment
          </h2>
          <div className="rounded-2xl bg-white/10 border-2 border-white/10 px-4 py-4">
            <p className="text-lg sm:text-xl font-ea">Domingo 8 de Febrero - 7am</p>
            <p className="text-base sm:text-lg mt-2">Bloque 29 para el registro</p>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full flex justify-center items-center pb-4 sm:pb-6 md:pb-10">
        <Footer_NOVA_blanco />
      </div>
    </div>
  );
}

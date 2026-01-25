"use client";

import AiesecForm from "../../globalcomponents/Forms/Form-Aiesec";
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
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#000072] text-white"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/AIESEC_Star1.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 -top-1 z-0 w-[39vw] max-w-[220px]
         sm:-right-10 sm:-top-12 sm:w-[80vw] 
         md:right-0 md:-top-2 md:w-[80vw] md:max-w-[320px]"
      />
      <img
        src="/AIESEC_Splash.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-3 -left-5 z-0 w-[45vw] max-w-[340px] 
        sm:-bottom-21 sm:-left-10 sm:w-[55vw] 
        md:-bottom-14 md:-left-10 md:w-[35vw] md:max-w-[420px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>

      <main className="flex flex-col row-start-2 items-center relative z-10 w-full">
        {/* Logo siempre centrado */}
        <div className="flex justify-center w-full mb-2 sm:mb-0 relative z-30">
         <img src="/AIESEC.svg" alt="AIESEC" className="relative top-1 left-0 h-auto w-[150px]  sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[340px]" />
        </div>

        

        {/* Formulario - puede expandirse */}
        <div className="-mt-5 w-full flex justify-center">
          <AiesecForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer_NOVA_blanco />
        </div>
      </main>
    </div>
  );
}

"use client";


import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import SpieForm from "../../globalcomponents/Forms/Form-Spie";
import { useEffect } from "react";
import Footer_NOVA_blanco from "../../globalcomponents/UI/Footer_NOVA_blanco";
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
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#000072] text-black"
    style={{
      position: "relative",
      overflow: "auto",
    }}
    >


      {/* Imágenes decorativas - fuera del main para posicionamiento absoluto correcto */}
      <img
        src="/SPIE_ManchaTop.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-14 top-1 z-0 w-[260px] h-auto
         sm:w-[100px] 
         md:w-[800px] md:left-[400px]"
      />
      <img
        src="/SPIE_ManchaBottom.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-[185px] right-0 z-0 w-[240px] h-auto
        sm:w-[100px]
        md:w-[800px] md:right-[-50px] md:bottom-[-100px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>
      

      {/* Logo + Formulario centrados juntos en la pantalla */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[500px] px-4 flex flex-col items-center">
        {/* Logo siempre arriba del form */}
        <div className="mb-[0px] z-20">
          <img
            src="/SPIE_logo.svg"
            alt="SPIE Logo"
            className="h-auto w-[150px] sm:w-[190px] md:w-[230px]"
          />
        </div>
       
        {/* Formulario - puede expandirse */}
        <div className="-mt-3 sm:-mt-5 w-full flex justify-center">
          <SpieForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-2 relative z-20">
          <Footer_NOVA_blanco/>
        </div>
      </div>

      
      
    </div>



        

  );
}

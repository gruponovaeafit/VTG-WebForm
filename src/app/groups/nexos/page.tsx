"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import NexosForm from "../../globalcomponents/Forms/Form-Nexos";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  
    const router = useRouter();
    useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch("/api/cookieCheck");
        if (!res.ok) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        router.push("/");
      }
    };

    checkCookie();
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [router]);

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-black"
    style={{
      position: "relative",
      overflow: "hidden",
    }}
    >


      {/* Imágenes decorativas - fuera del main para posicionamiento absoluto correcto */}
      <img
        src="/NEXOS_Cordon.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 -top-0 z-0 w-[39vw] max-w-[220px]
         sm:-right-10 sm:-top-12 sm:w-[80vw] 
         md:right-0 md:-top-2 md:w-[80vw] md:max-w-[320px]"
      />
      <img
        src="/NEXOS_Curva.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-7 right-[-110px] z-0 w-[100vw] max-w-[520px] 
        sm:-bottom-11 sm:right-[-100px] sm:w-[80vw] sm:max-w-[700px]
        md:-bottom-20 md:right-[-250px] md:w-[100vw] md:max-w-[900px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>
      

      {/* Logo + Formulario centrados juntos en la pantalla */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[500px] px-4 flex flex-col items-center">
        {/* Logo siempre arriba del form */}
        <div className="mb-[0px] z-20">
          <img
            src="/NEXOS.png"
            alt="AIESEC"
            className="h-auto w-[150px] sm:w-[190px] md:w-[230px] lg:w-[270px] xl:w-[310px]"
          />
        </div>
       
        {/* Formulario - puede expandirse */}
        <div className="-mt-3 sm:-mt-5 w-full flex justify-center">
          <NexosForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-8 sm:mt-0 md:mt-20">
          <Footer/>
        </div>
      </div>

      
      
    </div>



        

  );
}

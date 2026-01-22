"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import SeresForm from "../../globalcomponents/Forms/Form-Seres";
import InfoSeres from "../../globalcomponents/Info/Info-Seres";
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
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#0A69ED] text-black"
    style={{
      position: "relative",
      overflow: "hidden",
    }}
    >


      {/* Imágenes decorativas - fuera del main para posicionamiento absoluto correcto */}
      <img
        src="/SERES_ManchaTopleft.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 top-32 z-0 w-[70px] h-auto
         sm:w-[100px] 
         md:w-[150px]"
      />
      <img
        src="/SERES_ManchaBottom.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 z-0 w-[240px] h-auto
        sm:w-[100px]
        md:w-[500px]"
      />
      <img
        src="/SERES_ManchaTopRight.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-1 top-5 z-0 w-[70px] h-auto
         sm:w-[100px] 
         md:w-[150px]"
      />
     

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>
      

      {/* Logo + Formulario centrados juntos en la pantalla */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[500px] px-4 flex flex-col items-center">
        {/* Logo siempre arriba del form */}
        <div className="mb-[0px] z-20">
          <img
            src="/SERES_Logo.svg"
            alt=""
            className="h-auto w-[150px] sm:w-[190px] md:w-[330px]"
          />
        </div>
       
        {/* Formulario - puede expandirse */}
        <div className="w-full flex flex-col items-center text-white">
          <div className="-mt-4 sm:-mt-6">
            <InfoSeres />
          </div>
          
          <div className="-mt-10 sm:-mt-10">
            <SeresForm />
          </div>
        </div>
        

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-8 sm:mt-0 md:mt-20">
          <Footer/>
        </div>
      </div>

      
      
    </div>



        

  );
}

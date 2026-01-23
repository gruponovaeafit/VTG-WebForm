"use client";

import Footer from "@/app/globalcomponents/UI/Footer_NOVA_negro";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import OeForm from "../../globalcomponents/Forms/Form-OE";
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
        src="/OE_ManchaTop.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 z-0 w-[420px] h-auto
         sm:w-[760px] 
         md:w-[1200px]"
      />
      <img
        src="/OE_ManchaBottom.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 z-0 w-[280px] h-auto
        sm:w-[620px]
        md:w-[1100px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>
      

      {/* Logo + Formulario centrados juntos en la pantalla */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[500px] px-4 flex flex-col items-center">
        {/* Logo siempre arriba del form */}
        <div className="mb-[0px] z-20">
          <img
            src="/OE_Logo.png"
            alt="OE"
            className="h-auto w-[150px] sm:w-[190px] md:w-[230px]"
          />
        </div>
       
        {/* Formulario - puede expandirse */}
        <div className="-mt-3 sm:-mt-5 w-full flex justify-center">
          <OeForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-8 sm:mt-0 md:mt-20">
          <Footer/>
        </div>
      </div>

      
      
    </div>



        

  );
}

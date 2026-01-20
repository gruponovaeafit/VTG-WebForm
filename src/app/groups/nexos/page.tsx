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

      <div style={{ pointerEvents: "none" }}>
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col row-start-2 items-center relative z-10 w-full">
        {/* Logo siempre centrado */}
        <div className="flex justify-center w-full mb-2 sm:mb-0">
          <img src="/NEXOS.svg" alt="Nexos" width={150} height={120} />
        </div>

        {/* Formulario - puede expandirse */}
        <div className="-mt-3 sm:-mt-5 w-full flex justify-center">
          <NexosForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer/>
        </div>

      </main>

      
      
    </div>



        

  );
}

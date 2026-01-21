"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import TvuForm from "../../globalcomponents/Forms/Form-Tvu";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";

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
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/TVU_Screen.svg')",
      backgroundSize: "cover",
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
          <img src="/TVU.svg" alt="TVU" className="w-1/2" />
        </div>

        {/* Formulario - puede expandirse */}
        <div className="-mt-4 w-full flex justify-center">
          <TvuForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer/>
        </div>

      </main>

      
      
    </div>



        

  );
}

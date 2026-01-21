"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
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
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#FFFFFF] text-white"
    style={{
      position: "relative",
      overflow: "hidden",
    }}
    >


      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
         {/* Logo siempre centrado */}
        <div className="flex justify-center w-full mb-2 sm:mb-0">
          <img
            src="/NEXOS.png"
            alt="AIESEC"
            className="h-auto w-[150px] sm:w-[190px] md:w-[230px] lg:w-[270px] xl:w-[310px]"
          />
        </div>
       

        <NexosForm />

        <Footer/>

      </main>

      
      
    </div>



        

  );
}

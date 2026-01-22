"use client";

import UnForm from "../../globalcomponents/Forms/Form-Un";
import { useEffect } from "react";
import Footer from "@/app/globalcomponents/UI/Footer";
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
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#0066FF] text-white"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/UN_ManchaTop.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 -top-1 z-0 w-[60vw] max-w-[500px]
         sm:-right-10 sm:-top-12 sm:w-[80vw] 
         md:right-0 md:-top-2 md:w-[80vw] md:max-w-[520px]"
      />
      <img
        src="/UN_ManchaBotton.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 z-0 w-[60vw] max-w-[500px] 
        sm:-bottom-21 sm:-left-10 sm:w-[55vw] 
        md:-bottom-10 md:left-0 md:w-[60vw] md:max-w-[700px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>

      <main className="flex flex-col row-start-2 items-center relative z-10 w-full">
        {/* Logo siempre centrado */}
        <div className="flex justify-center w-full mb-2 sm:mb-0 relative z-30">
         <img src="/UN_Logo.svg" alt="AIESEC" className="relative top-1 left-0 h-auto w-[150px]  sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[340px]" />
        </div>

        

        {/* Formulario - puede expandirse */}
        <div className="-mt-5 w-full flex justify-center">
          <UnForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer />
        </div>
      </main>
    </div>
  );
}

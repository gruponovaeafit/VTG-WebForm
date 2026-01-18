"use client";

import AiesecForm from "../../globalcomponents/Forms/Form-Aiesec";
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
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#000072] text-white"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/AIESEC_Star.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 top-0 z-0 w-[45vw] max-w-[380px] md:w-[30vw]"
      />
      <img
        src="/AIESEC_Splash.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 z-0 w-[55vw] max-w-[420px] md:w-[35vw]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>

      <main className="flex flex-col row-start-2 items-center relative z-10 w-full">
        {/* Logo siempre centrado */}
        <div className="flex justify-center w-full mb-2 sm:mb-0">
          <img src="/AIESEC.svg" alt="AIESEC" width={150} height={120} />
        </div>

        {/* Formulario - puede expandirse */}
        <div className="-mt-5 w-full flex justify-center">
          <AiesecForm />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer />
        </div>
      </main>
    </div>
  );
}

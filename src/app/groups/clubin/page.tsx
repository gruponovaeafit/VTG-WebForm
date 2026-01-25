"use client";

import { useEffect } from "react";
import Clubin1Form from "@/app/globalcomponents/Forms/Form-Clubin";
import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import Footer_NOVA_blanco from "@/app/globalcomponents/UI/Footer_NOVA_blanco";
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
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/CLUBIN_Solid.svg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >
     <img
  src="/CLUBIN_E1.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none select-none absolute top-0 right-0 -translate-y-1/4 translate-x-1/4
    z-0 w-[45vw] max-w-[260px]
  "
/>
      <img
  src="/CLUBIN_E2.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none select-none absolute bottom-0 left-0  
    z-0 w-[55vw] max-w-[380px]
  "
/>

        <div style={{ pointerEvents: "none" }}>
          { <ConfettiAnimation /> }
        </div>  

      {/* Contenido principal */}
      <main className="flex flex-col gap-0 row-start-2 items-center sm:items-start relative z-10 font-extrabold font-extrabold mb-2 ">
        <img src="/CLUBIN.svg" alt="CLUBIN" width={150} height={120} />

        <div className="-mt-5">
          <Clubin1Form />
        </div>

        {/* Footer siempre centrado */}
        <div className="flex justify-center w-full mt-2 sm:mt-0">
          <Footer_NOVA_blanco />  
        </div>

      </main>  
      
    </div>    

  );
}

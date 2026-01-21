"use client";

import ClubinForm from "../../globalcomponents/Forms/Form-Clubin";
import Image from "next/image";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Clubin1Form from "@/app/globalcomponents/Forms/Form-Clubin";
import Footer from "@/app/globalcomponents/UI/Footer";
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

        <Footer />

      </main>  
      
    </div>    

  );
}

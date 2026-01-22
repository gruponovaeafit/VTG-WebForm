"use client";


import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import ClubmercForm from "../../globalcomponents/Forms/Form-Clubmerc";
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
      backgroundImage: "url('/CLUBMERC_Solid.svg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >
      <img
  src="/CLUBMERC_E1.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none select-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4
    z-0 w-[120%] max-w-none
  "
/>

<img
  src="/CLUBMERC_E2.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4
    z-0 w-[120%] max-w-none
  "
/>

        <div style={{ pointerEvents: "none" }}>
          { <ConfettiAnimation /> }
        </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center relative z-10 ">
        <img src="/CLUBMERC.svg" alt="CLUBMERC" width={150} height={120} className="mx-auto" />

        <div className="-mt-5">
          <ClubmercForm/>
        </div>

        <Footer/>
      </main>

    </div>
  );
}

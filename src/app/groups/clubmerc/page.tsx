"use client";


import Footer from "@/app/globalcomponents/UI/Footer_NOVA_negro";
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
      <img src="/CLUBMERC_E1.svg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none select-none absolute right-0 top-0 z-0 w-[270px] h-auto
         sm:w-[100px] 
         md:w-[900px] md:right-[0px]"
      />
      <img
      src="/CLUBMERC_E2.svg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none select-none absolute bottom-[0px] right-4 z-0 w-[380px] h-auto
        sm:w-[100px]
        md:w-[3000px] md:left-[-400px] md:bottom-[-150px]"
      />

        <div style={{ pointerEvents: "none" }}>
          { <ConfettiAnimation /> }
        </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <img src="/CLUBMERC.svg" 
        alt="CLUBMERC"   
        className="h-auto w-[150px] sm:w-[190px] md:w-[230px]" />

        <div className="-mt-5">
          <ClubmercForm/>
        </div>

        <Footer/>
      </main>

    </div>
  );
}

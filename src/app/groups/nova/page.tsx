"use client";

import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import Form from "../../globalcomponents/Forms/Form-NOVA";
import { useEffect } from "react";
import Footer from "@/app/globalcomponents/UI/Footer_NOVA";
import { useRouter } from "next/navigation";


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
      backgroundImage: "url('/NOVA_Screen.svg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col row-start-2 items-center relative z-10 w-full">

        <Form />

        <Footer/>
      </main>
      
    </div>     

  );
}

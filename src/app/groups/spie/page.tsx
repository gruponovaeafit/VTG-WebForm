"use client";

import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import InfoSPIE from "@/app/globalcomponents/Info/Info-SPIE";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkAuthentication = async () => { 
      try {
        const res = await fetch("/api/cookieCheck", { method: "GET" });
        
          // If the response status is not 200, redirect the user to the home page
          if (res.status !== 200) {
            router.push("/"); // Redirect to the home page if not authenticated
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          router.push("/"); // Redirect to the home page in case of error
        }
    }
    checkAuthentication();
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-center h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white"
      style={{
        backgroundImage: "url('/spie.jpg')",
        backgroundSize: "cover",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animación de píxeles */}
      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col row-start-2 items-center sm:items-start relative z-10">
        <h1 className="text-5xl md:text-2xl text-center mb-6 pixel-font text-white glitch_Spie">
          SPIE
        </h1>
        
        <InfoSPIE />

      </main>
    </div>
  );
}

"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import PartnersForm from "../../globalcomponents/Forms/Form-Partners";
import InfoPartners from "@/app/globalcomponents/Info/Info-Partners";
import { useEffect } from "react";
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
      // Remueve overflow:hidden y añade overflow-auto para permitir scroll
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white overflow-auto"
      style={{
        backgroundImage:
          "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/partners.svg')",
        backgroundSize: "cover",
        position: "relative",
        // overflow: "hidden", // Quita o comenta esta línea
      }}
    >
      {/* Animación de píxeles (sin afectar eventos del mouse) */}
      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center pixel-font text-white glitch_partners">
          PARTNERS
        </h1>

        <InfoPartners />

        <PartnersForm />

        <Footer />
      </main>
    </div>
  );
}
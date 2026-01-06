"use client";

import { useRouter } from "next/navigation";
import TalkEmailForm from "../globalcomponents/Forms/Form-EmailTalk";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch("/api/cookieCheck");
        if (!res.ok) {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        router.replace("/");
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
      className="relative flex flex-col justify-center items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/nova.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl md:text-3xl pixel-font text-white glitch_NOVA">
          Charla
        </h1>
        <h1 className="text-4xl md:text-3xl mb-2 pixel-font text-white glitch_NOVA">
          NOVA
        </h1>


        <TalkEmailForm />

        <footer className="flex items-center justify-center relative z-10">
              <Image
                        src="/PoweredByLOVE.svg"
                        alt="Powered By NOVA"
                        className="w-40 h-10"
                        width={240} // Equivalent to w-40
                        height={120} // Equivalent to h-20
              />
        </footer>

      </main>
      
    </div>
  );
}

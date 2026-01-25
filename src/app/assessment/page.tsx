"use client";

import AssessmentForm from "../globalcomponents/Forms/Form-Assessment";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Image from "next/image";
import { useEffect } from "react";
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
        <h1 className="text-3xl md:text-3xl mb-6 pixel-font text-white glitch_NOVA">
          Assessment NOVA
        </h1>


        <AssessmentForm />

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

"use client";

import Image from 'next/image'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);

    return () => clearTimeout(timer); // Limpieza del temporizador
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Fondo animado */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Background.gif')",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Contenido */}
      <div className="relative z-10 text-center">
        <Image
          src="/VTG.svg"
          alt="VTG"
          className="mx-auto mt-4 w-80 md:w-80"
        />
        <Image
          src="/logoeafit.svg"
          alt="Universidad EAFIT"
          className="mx-auto mt-4 w-40 md:w-48"
        />
      </div>
    </div>
  );
}

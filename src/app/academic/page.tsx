"use client";

import AcademicForm from "../globalcomponents/Forms/Form-Academic";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/globalcomponents/UI/Footer";

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
      className="relative flex items-center justify-center w-full h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/coins.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal más pequeño y centrado */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center bg-opacity-80 p-8 rounded-lg shadow-lg w-[90%] max-w-lg">
        <h1 className="text-2xl md:text-3xl mb-6 pixel-font text-white-300">
          ¡Formulario Académico!
        </h1>
        <AcademicForm />

        <Footer />

      </main>

      

    </div>
  );
}

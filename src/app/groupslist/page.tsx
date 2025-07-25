"use client";

import GroupsForm from "../globalcomponents/Forms/Form-Groups";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation"


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
      className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden"
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

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center text-center p-8 sm:p-20 w-[90%] max-w-lg gap-8">
        <h1 className="text-2xl md:text-4xl font-bold pixel-font text-yellow-300">
          ¡Escoge el grupo de tu preferencia!
        </h1>

        {/* Formulario arcade */}
        <GroupsForm />

        <Footer />

      </main>

    </div>
  );
}

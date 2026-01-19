"use client";

import GroupsForm from "../globalcomponents/Forms/Form-Groups";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import ConfettiAnimation from "../globalcomponents/UI/ConfettiAnimation";


export default function Home() {
  const router = useRouter();

  {/*useEffect(() => {
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
  }, [router]);*/}

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden"
      style={{  
        backgroundImage: "url('/main.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-ea text-white-300">
            Escoge
          </h1>
          <h1 className="text-5xl font-ea text-white-300">
            Tu grupo
          </h1>
        </div>
        {/* Formulario arcade */}
        <GroupsForm />

        <Footer />

      </main>

    </div>
  );
}

"use client";

import PersonalForm from "../globalcomponents/Forms/Form-Personal";
import ConfettiAnimation from "../globalcomponents/UI/ConfettiAnimation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  {/*useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch("/api/cookieCheck");
        if (!res.ok) {
          router.push("/email");
        }
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        router.push("/email");
      }
    };

    checkCookie();
  }, [router]);*/}

  return (
    <div
      className="relative flex flex-col justify-between w-full h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/main.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ConfettiAnimation/>
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-ea text-white-300">
            Informacion
          </h1>
          <h1 className="text-5xl font-ea text-white-300">
            Personal
          </h1>
        </div>
        <div className="-mt-5">
          <PersonalForm />
        </div>

        <Footer />
      </main>
    </div>
  );
}

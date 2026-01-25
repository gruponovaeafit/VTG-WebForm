"use client";

import PersonalForm from "../globalcomponents/Forms/Form-Personal";
import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import Footer_NOVA_blanco from "../globalcomponents/UI/Footer_NOVA_blanco";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

export default function Home() {
  const isVerified = useAuthCheck("/email");

  if (!isVerified) return null;

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

        <Footer_NOVA_blanco />
      </main>
    </div>
  );
}

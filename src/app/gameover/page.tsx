"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("no-scroll");

    // Mostrar el botón después de 5 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    };
  }, []);

  const handleRestart = () => {
    router.push("/"); // Redirige a la ruta "/"
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10">
        <h1 className="text-4xl md:text-1xl text-center mb-6 pixel-font text-white glitch">
          GAME
          <br />
          OVER
        </h1>

        {showButton && (
          <button
            onClick={handleRestart}
            className="mt-6 py-2 px-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition duration-300"
          >
            RESTART
          </button>
        )}

        <Footer />
      </main>
    </div>
  );
}

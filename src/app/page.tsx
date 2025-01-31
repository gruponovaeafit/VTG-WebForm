"use client";

import { useRouter } from "next/navigation";
import PixelsAnimation from "./globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import Footer from "./globalcomponents/UI/Footer";

export default function MainPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/email");
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-screen overflow-hidden">
      {/* Fondo que ocupa toda la pantalla */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/coins.png')" }}
      ></div>

      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow">
        <button
          onClick={handleRedirect}
          className="w-48 h-24 md:w-64 md:h-32 bg-center justify-center bg-contain animate-growShrink focus:outline-none"
          style={{
            backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/START.png')",
          }}
          type="button"
        />

        <Footer />

      </div>
      
    </div>
  );
}



"use client";


import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import NOVAForm from "../../globalcomponents/Forms/Form-NOVA";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

    <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/NOVA.jpeg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-5xl md:text-2xl text-center mb-6 pixel-font text-white glitch_NOVA">
          NOVA
        </h1>

        <NOVAForm />

      </main>

    </div>
  );
}

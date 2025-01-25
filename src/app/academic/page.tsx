"use client";

import AcademicForm from "../globalcomponents/Forms/Form-Academic";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";

export default function Home() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
      style={{
        backgroundImage: "url('/back_landing_coins.png')",
        backgroundSize: "cover",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl md:text-6xl text-center mb-6 pixel-font text-yellow-300">
          ¡Bienvenido al Retro Formulario!
        </h1>

        <AcademicForm />

      </main>
    </div>
  );
}

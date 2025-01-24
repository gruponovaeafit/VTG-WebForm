"use client";

import Image from "next/image";
import EmailForm from "../globalcomponents/Form-Email";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";


export default function Home() {


  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/coins.png')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >
    
      <PixelsAnimation />

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">

        <h1 className="text-2xl md:text-1xl text-center mb-6 pixel-font text-white">
          ¡Bienvenidx al Formulario VTG!
        </h1>

        <EmailForm />

        <Image
          src="/PoweredByNOVA.svg"
          alt="Powered By NOVA"
          className="w-40 md:w-48"
          width={300}
          height={200}
        />

      </main>

    </div>
  );
}

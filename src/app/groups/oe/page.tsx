"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import OEForm from "../../globalcomponents/Forms/Form-OE";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {


  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/oe.svg')",
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
      <h1 className="text-6xl md:text-2xl text-center mb-6 pixel-font text-white glitch_OE">
        OE
      </h1>

        <OEForm />


        <Footer />

      </main>

      
      
    </div>



        

  );
}

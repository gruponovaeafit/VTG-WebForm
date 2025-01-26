"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import SpieForm from "../../globalcomponents/Forms/Form-Spie";
import InfoSPIE from "@/app/globalcomponents/Info/Info-SPIE";


export default function Home() {

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/spie.jpg')",
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
        <h1 className="text-5xl md:text-2xl text-center pixel-font text-white glitch_Spie">
          Spie
        </h1>

        <InfoSPIE/>
        
        <SpieForm />

        {/* Footer */}
        <Footer/>

      </main>

      
      
    </div>



        

  );
}

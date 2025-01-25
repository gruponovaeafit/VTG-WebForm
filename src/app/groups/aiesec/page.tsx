"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import AiesecForm from "../../globalcomponents/Forms/Form-Aiesec";

export default function Home() {
  
  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/aiesec.jpg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

        <div style={{ pointerEvents: "none" }}>
          <PixelsAnimation />
        </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-4xl md:text-2xl text-center pixel-font text-white glitch_aiesec">
          AIESEC
        </h1>

        <AiesecForm />

        {/* Footer */}      
        <Footer />



      </main>

      
      
    </div>



        

  );
}

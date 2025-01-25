"use client";

import Image from "next/image";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import ClubinForm from "../../globalcomponents/Forms/Form-Clubin";

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
        <div style={{ pointerEvents: "none" }}>
          { <PixelsAnimation /> }
        </div>  

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-4xl md:text-2xl text-center mb-6 pixel-font text-white glitch_partners">
          CLUBIN
        </h1>

        <ClubinForm />

        {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center py-2 mb-10">
        <Image
          src="/PoweredByNOVA.svg"
          alt="Powered By NOVA"
          className="w-40 md:w-48"
          width={300}
          height={200}
        />
      </footer>

      </main>

      
      
    </div>



        

  );
}

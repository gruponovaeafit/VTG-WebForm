"use client";

import Image from "next/image";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Clubin1Form from "@/app/globalcomponents/Forms/Form-Clubin";

export default function Home() {


  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/clubin.svg')",
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
        <h1 className="text-4xl md:text-2xl text-center mb-6 pixel-font text-white pulse">
          CLUBIN
        </h1>

        <Clubin1Form />

        {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center py-2 mb-10">
        <Image
          src="https://novaeafit.blob.core.windows.net/vtg-2025-1/PoweredByNOVA.svg"
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

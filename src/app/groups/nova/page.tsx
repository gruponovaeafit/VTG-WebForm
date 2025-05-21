"use client";

import Image from "next/image";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import TalkForm from "../../globalcomponents/Forms/Form-Talk";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {



  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white"
    style={{
      backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/nova.svg')",
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

        <TalkForm />

        <footer className="flex items-center justify-center relative z-10">
              <Image
                src="https://novaeafit.blob.core.windows.net/vtg-2025-1/PoweredByLOVE.svg"
                alt="Powered By NOVA"
                className="w-40 h-10"
                width={240} // Equivalent to w-40
                height={120} // Equivalent to h-20
              />
            </footer>

      </main>

 

    </div>
  );
}

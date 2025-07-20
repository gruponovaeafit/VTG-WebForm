"use client";

import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import AiesecForm from "../../globalcomponents/Forms/Form-Aiesec";
import { useEffect } from "react";
import Footer from "@/app/globalcomponents/UI/Footer";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/aiesec.svg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

        <div style={{ pointerEvents: "none" }}>
          <PixelsAnimation />
        </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center pixel-font text-white glitch_aiesec">
          AIESEC
        </h1>

        <AiesecForm />

      <Footer/>

      </main>

    </div>



        

  );
}

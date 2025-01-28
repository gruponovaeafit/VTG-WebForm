"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import { useEffect } from "react";


export default function Home() {

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
  

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">

        <h1 className="text-4xl md:text-1xl text-center mb-6 pixel-font text-white glitch">
          GAME OVER
        </h1>

        <Footer/>

      </main>

    </div>
  );
}

"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import SeresForm from "../../globalcomponents/Forms/Form-Seres";
import InfoSeres from "@/app/globalcomponents/Info/Info-Seres";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  
  return (
    <div
    className="relative flex flex-col justify-center items-center min-h-screen p-4 sm:p-8 md:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white overflow-y-auto"
    style={{
      backgroundImage: "url('/SERES_Screen.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    >

      <div className="absolute inset-0 pointer-events-none z-0">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center w-full max-w-2xl py-4">
        <img src="/SERES.svg" alt="Seres" className="w-1/2" />
        <div className="flex flex-col gap-0 mb-2">
          <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-ea text-white">
            Seres
          </h1>
        </div>
        
        <div className="w-full flex flex-col items-center">
          <InfoSeres />
          
          <div className="-mt-10 sm:-mt-10">
            <SeresForm />
          </div>
        </div>

        <div className="mt-4">
          <Footer/>
        </div>

      </main>
      
    </div>



        

  );
}

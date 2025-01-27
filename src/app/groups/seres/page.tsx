"use client";

import Footer from "@/app/globalcomponents/UI/Footer";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import SeresForm from "../../globalcomponents/Forms/Form-Seres";
import InfoSeres from "@/app/globalcomponents/Info/Info-Seres";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
    const router = useRouter();
    useEffect(() => {
      const checkAuthentication = async () => { 
        try {
          const res = await fetch("/api/cookieCheck", { method: "GET" });
          
            // If the response status is not 200, redirect the user to the home page
            if (res.status !== 200) {
              router.push("/"); // Redirect to the home page if not authenticated
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
            router.push("/"); // Redirect to the home page in case of error
          }
      }
      document.body.classList.add("no-scroll");
      return () => {
        document.body.classList.remove("no-scroll");
      };
    }, []);

  
  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-3 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/seres.svg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-4xl md:text-2xl text-center mb-4 pixel-font text-white glitch_Seres">
          Seres
        </h1>

        <InfoSeres />
        <SeresForm />

        {/* Footer */}
        <Footer/>

      </main>

      
      
    </div>



        

  );
}

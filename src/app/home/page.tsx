"use client";

import PersonalForm from "../globalcomponents/Forms/Form-Personal";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
import Footer from "../globalcomponents/UI/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(()   =>   {
  // copiar esta parte 
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
  
  checkAuthentication();
  // hasta aca y poner las liberias 

    // Elimina el scroll de la página
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; // Restaura el scroll al salir
    };
  }, []);

  return (
    <div
      className="relative flex flex-col justify-between w-full h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/coins.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-2xl md:text-3xl mb-4 pixel-font text-white-300">
          ¡Formulario Personal!
        </h1>
        <PersonalForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

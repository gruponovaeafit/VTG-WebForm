"use client";

import AcademicForm from "../globalcomponents/Forms/Form-Academic";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import { useEffect } from "react";
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
      className="relative flex items-center justify-center w-full h-screen bg-black text-white overflow-hidden"
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

      {/* Contenido principal más pequeño y centrado */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center bg-opacity-80 p-8 rounded-lg shadow-lg w-[90%] max-w-lg">
        <h1 className="text-2xl md:text-3xl mb-6 pixel-font text-white-300">
          ¡Formulario Académico!
        </h1>
        <AcademicForm />
      </main>
    </div>
  );
}

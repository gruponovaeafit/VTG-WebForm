"use client";

import GroupsForm from "../globalcomponents/Forms/Form-Groups";
import PixelsAnimation from "../globalcomponents/UI/Pixels_animation";
import Footer from "../globalcomponents/UI/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation"


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
    checkAuthentication();
    // Elimina el scroll de la página
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden"
      style={{
        backgroundImage: "url('https://novaeafit.blob.core.windows.net/vtg-2025-1/coins.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelsAnimation />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center text-center p-8 sm:p-20 w-[90%] max-w-lg gap-8">
        <h1 className="text-2xl md:text-4xl font-bold pixel-font text-yellow-300">
          ¡Escoge el grupo de tu preferencia!
        </h1>

        {/* Formulario arcade */}
        <GroupsForm />

        <Footer />

      </main>

    </div>
  );
}

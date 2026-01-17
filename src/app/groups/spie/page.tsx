"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/globalcomponents/UI/Footer";
import ConfettiAnimation from "@/app/globalcomponents/UI/ConfettiAnimation";
import SpieForm from "@/app/globalcomponents/Forms/Form-Spie";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch("/api/cookieCheck");
        if (!res.ok) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        router.push("/");
      }
    };

    checkCookie();
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [router]);

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-center h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white"
      style={{
        backgroundImage: "url('/spie.svg')",
        backgroundSize: "cover",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ pointerEvents: "none" }}>
        <ConfettiAnimation />
      </div>
      
      {/* Contenido principal */}
      <main className="flex flex-col row-start-2 items-center sm:items-start relative z-10">
        
        <SpieForm />

        <Footer/>

      </main>
    </div>
  );
}

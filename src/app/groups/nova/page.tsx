"use client";

import Image from "next/image";
import PixelsAnimation from "../../globalcomponents/UI/Pixels_animation";
import NOVAForm from "../../globalcomponents/Forms/Form-NOVA";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

    <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white"
    style={{
      backgroundImage: "url('/nova.svg')",
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

        <NOVAForm />

        <footer className="flex items-center justify-center relative z-10">
              <Image
                src="/PoweredByLOVE.svg"
                alt="Powered By NOVA"
                className="w-40 h-20"
                width={240} // Equivalent to w-40
                height={120} // Equivalent to h-20
              />
            </footer>

      </main>

 

    </div>
  );
}

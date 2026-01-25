"use client";

import { useRouter } from "next/navigation";
import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import { useEffect, useState } from "react";
import Footer_NOVA_blanco from "./globalcomponents/UI/Footer_NOVA_blanco";

export default function MainPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/email");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const [currentTag, setCurrentTag] = useState("");
  const [isOut, setIsOut] = useState(false);

  const tags = ["#NOVA", "#NEXOS", "#OE", "#UN SOCIETY", "#CLUBMERC", "#GPG", "#CLUBIN", "#SPIE", "#SERES", "#TVU", "#AIESEC", "#PARTNERS", "#TUTORES"];
  const intervalMs = 900;
  
  // Calcular el ancho máximo necesario para el tag más largo
  const maxTagLength = Math.max(...tags.map(tag => tag.length));

  // Función para obtener un tag aleatorio diferente al actual
  const getRandomTag = (current: string) => {
    if (tags.length === 1) return tags[0];
    
    let newTag;
    do {
      newTag = tags[Math.floor(Math.random() * tags.length)];
    } while (newTag === current && tags.length > 1);
    
    return newTag;
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");
    // Inicializar con un tag aleatorio
    setCurrentTag(getRandomTag(""));
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOut(true);   
      setTimeout(() => {
        setCurrentTag((prev) => getRandomTag(prev));
        setIsOut(false);
      }, 150);
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-screen overflow-hidden">
      {/* Fondo que ocupa toda la pantalla */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/Loading.svg')" }}
      ></div>

      {/* Animación de píxeles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <ConfettiAnimation />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow">
        <div className="title flex flex-col">
          <div className="line1 text-white text-2xl font-bold pl-20 mb-0"><span className="font-fifa26">SOMOS</span><span className="font-ea"> VTG</span></div>
          <div className="line2 text-white font-extrabold text-2xl text-center pl-20 -mt-2">
            <span className="inline-flex items-center">
              <span 
                id="tag"
                className={`inline-block text-left font-fwc26 transition-all duration-250 ease-in-out ${
                  isOut ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
                }`}
                style={{ width: `${maxTagLength}ch` }}
              >
                {currentTag}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-0 justify-center items-center">
        <Footer_NOVA_blanco/>
      </div>

    </div>
  );
}

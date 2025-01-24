"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import GpgForm from "../globalcomponents/Form-Gpg";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numPixels = 25; // Número de píxeles en pantalla
    const pixels = Array.from({ length: numPixels }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 17 + 5, // Tamaño de los píxeles
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
      speedX: (Math.random() - 0.5) * 2, // Velocidad en X
      speedY: (Math.random() - 0.5) * 2, // Velocidad en Y
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pixels.forEach((pixel) => {
        // Dibujar el píxel
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);

        // Mover el píxel
        pixel.x += pixel.speedX;
        pixel.y += pixel.speedY;

        // Rebote en los bordes
        if (pixel.x <= 0 || pixel.x + pixel.size >= canvas.width) {
          pixel.speedX *= -1;
        }
        if (pixel.y <= 0 || pixel.y + pixel.size >= canvas.height) {
          pixel.speedY *= -1;
        }

        // Cambiar color aleatoriamente
        if (Math.random() > 0.99) {
          pixel.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`;
        }
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white"
    style={{
      backgroundImage: "url('/gpg.jpg')",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
    >

      {/* Lienzo para la animación */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Contenido principal */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 ">
        <h1 className="text-5xl md:text-2xl text-center mb-6 pixel-font text-white glitch_gpg">
          GPG
        </h1>

        <GpgForm />

        {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center py-2 mb-10">
        <Image
          src="/PoweredByNOVA.svg"
          alt="Powered By NOVA"
          className="w-40 md:w-48"
          width={300}
          height={200}
        />
      </footer>

      </main>

      
      
    </div>



        

  );
}

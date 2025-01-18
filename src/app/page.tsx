"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoadingPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/home");
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numPixels = 30; // Número de píxeles en pantalla
    const pixels = Array.from({ length: numPixels }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 5, // Tamaño de los píxeles
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
    <div className="flex flex-col justify-between min-h-screen bg-black relative overflow-hidden">
      {/* Fondo y lienzo para la animación */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/back_landing_coins.png')",
          backgroundSize: "cover",
        }}
      ></div>
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

      {/* Contenido central */}
      <div className="flex items-center justify-center flex-grow relative z-10">
        <button
          onClick={handleRedirect}
          className="w-64 h-32 bg-no-repeat bg-center bg-contain animate-growShrink"
          style={{
            backgroundImage: "url('/START.png')",
          }}
          type="button"
        >
          <span className="sr-only">Start</span>
        </button>
      </div>

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

    </div>
  );
}

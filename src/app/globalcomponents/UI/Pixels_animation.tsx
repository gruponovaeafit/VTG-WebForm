"use client";
import { useEffect, useRef } from "react";

export default function PixelsAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numPixels = 25; // Número de pixeles en pantalla
    const pixels = Array.from({ length: numPixels }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 17 + 5, // Tamaño de los pixeles
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
      speedX: (Math.random() - 0.5) * 2, // Velocidad en X
      speedY: (Math.random() - 0.5) * 2, // Velocidad en Y
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pixels.forEach((pixel) => {
        // Dibujar el pixel
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);

        // Mover el pixel
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

    <div>
      {/* Lienzo para la animacion */}
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

    </div>
    );
}

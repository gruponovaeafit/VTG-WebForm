"use client";
import { useEffect, useRef } from "react";

export default function PixelsAnimation({ minSize = 16, maxSize = 20 }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Función para inicializar el canvas
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const numPixels = 25; // Número de píxeles en pantalla
    let pixels: any[] = [];
    let animationId: number;
    let previousWidth = window.innerWidth;
    let previousHeight = window.innerHeight;

    // Función para crear píxeles con posiciones relativas
    const createPixels = () => {
      return Array.from({ length: numPixels }, () => {
        // Asegurar distribución aleatoria por toda la pantalla
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        return {
          x: x,
          y: y,
          // Posiciones relativas (0-1) para mantener proporciones
          relativeX: x / canvas.width,
          relativeY: y / canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
        };
      });
    };

    // Inicializar canvas y crear píxeles
    initCanvas();
    
    // Pequeño delay para asegurar que el canvas esté listo
    setTimeout(() => {
      pixels = createPixels();
      // Iniciar animación después de crear los píxeles
      animationId = requestAnimationFrame(animate);
    }, 10);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pixels.forEach((pixel) => {
        // Dibujar el píxel
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);

        // Mover el píxel
        pixel.x += pixel.speedX;
        pixel.y += pixel.speedY;

        // Actualizar posiciones relativas
        pixel.relativeX = pixel.x / canvas.width;
        pixel.relativeY = pixel.y / canvas.height;

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

      animationId = requestAnimationFrame(animate);
    };

    // Función para manejar el resize
    const handleResize = () => {
      // Cancelar la animación actual
      cancelAnimationFrame(animationId);
      
      // Guardar dimensiones anteriores
      const oldWidth = previousWidth;
      const oldHeight = previousHeight;
      
      // Actualizar dimensiones actuales
      previousWidth = window.innerWidth;
      previousHeight = window.innerHeight;
      
      // Reinicializar canvas
      initCanvas();
      
      // Ajustar posiciones de píxeles existentes proporcionalmente
      pixels.forEach((pixel) => {
        // Mantener posiciones relativas
        pixel.x = pixel.relativeX * canvas.width;
        pixel.y = pixel.relativeY * canvas.height;
        
        // Ajustar velocidades proporcionalmente
        const widthRatio = canvas.width / oldWidth;
        const heightRatio = canvas.height / oldHeight;
        pixel.speedX *= widthRatio;
        pixel.speedY *= heightRatio;
      });
      
      // Reiniciar la animación
      animationId = requestAnimationFrame(animate);
    };

    // Agregar listener para resize
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [minSize, maxSize]);

  return (
    <div>
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
    </div>
  );
}
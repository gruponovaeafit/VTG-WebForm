"use client";
import { useEffect, useRef } from "react";

type ConfettiPiece = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
};

export default function ConfettiAnimation({ 
  numPieces = 50,
  minSize = 8,
  maxSize = 16 
}: { 
  numPieces?: number;
  minSize?: number;
  maxSize?: number;
}) {
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

    let confetti: ConfettiPiece[] = [];
    let animationId: number;

    // Colores vibrantes para el confeti
    const colors = [
      "#FF6B6B", // Rojo
      "#4ECDC4", // Turquesa
      "#45B7D1", // Azul
      "#FFA07A", // Salmón
      "#98D8C8", // Verde menta
      "#F7DC6F", // Amarillo
      "#BB8FCE", // Púrpura
      "#85C1E2", // Azul claro
      "#F8B739", // Naranja
      "#52BE80", // Verde
    ];

    // Función para crear confeti
    const createConfetti = (): ConfettiPiece[] => {
      return Array.from({ length: numPieces }, () => {
        const size = Math.random() * (maxSize - minSize) + minSize;
        const shape: "rect" | "circle" = Math.random() > 0.5 ? "rect" : "circle";
        
        return {
          x: Math.random() * canvas.width,
          y: -maxSize, // Empezar desde arriba de la pantalla
          width: shape === "rect" ? size : size,
          height: shape === "rect" ? size * 0.6 : size, // Rectángulos más delgados
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: Math.random() * 3 + 2, // Velocidad vertical (caída)
          speedX: (Math.random() - 0.5) * 2, // Movimiento horizontal aleatorio
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5, // Velocidad de rotación
          shape: shape,
        };
      });
    };

    // Inicializar canvas y crear confeti
    initCanvas();
    
    setTimeout(() => {
      confetti = createConfetti();
      animationId = requestAnimationFrame(animate);
    }, 10);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((piece, index) => {
        // Guardar el estado del canvas
        ctx.save();
        
        // Mover al centro del confeti para rotar
        ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        
        // Dibujar el confeti
        ctx.fillStyle = piece.color;
        
        if (piece.shape === "rect") {
          ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, piece.width / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Restaurar el estado del canvas
        ctx.restore();

        // Mover el confeti
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;

        // Si el confeti sale por abajo, reiniciarlo arriba
        if (piece.y > canvas.height) {
          piece.y = -maxSize;
          piece.x = Math.random() * canvas.width;
          piece.speedY = Math.random() * 3 + 2;
          piece.speedX = (Math.random() - 0.5) * 2;
        }

        // Si sale por los lados, reiniciarlo
        if (piece.x < -maxSize || piece.x > canvas.width + maxSize) {
          piece.y = -maxSize;
          piece.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    // Función para manejar el resize
    const handleResize = () => {
      cancelAnimationFrame(animationId);
      initCanvas();
      
      // Ajustar posiciones de confeti existentes
      confetti.forEach((piece) => {
        piece.x = (piece.x / canvas.width) * canvas.width;
        if (piece.y < 0) {
          piece.y = -maxSize;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    // Agregar listener para resize
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [numPieces, minSize, maxSize]);

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
          pointerEvents: "none",
        }}
      />
    </div>
  );
}


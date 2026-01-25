"use client";

import dynamic from "next/dynamic";

// Lazy load ConfettiAnimation - solo carga cuando se renderiza
const ConfettiAnimation = dynamic(
  () => import("./ConfettiAnimation"),
  { 
    ssr: false,
    loading: () => null // No mostrar nada mientras carga
  }
);

export default ConfettiAnimation;

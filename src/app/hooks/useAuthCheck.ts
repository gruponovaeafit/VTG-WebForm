"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook para verificar autenticación antes de renderizar una página
 * @param redirectTo - URL a donde redirigir si no hay autenticación (default: "/")
 * @returns isVerified - true cuando el usuario está autenticado, false mientras verifica
 */
export function useAuthCheck(redirectTo: string = "/"): boolean {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch("/api/cookieCheck");
        if (!res.ok) {
          router.replace(redirectTo);
          return;
        }
        setIsVerified(true);
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        router.replace(redirectTo);
      }
    };

    checkCookie();
  }, [router, redirectTo]);

  return isVerified;
}

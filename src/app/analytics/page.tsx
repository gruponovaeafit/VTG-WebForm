"use client";

import { useState } from "react";
import Dashboard from "@/app/globalcomponents/analytics/dashboard";

// Variable de entorno para la contraseña
const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_ANALY_TSS;

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = () => {
    if (!GLOBAL_PASSWORD) {
      console.error("La contraseña global no está configurada.");
      alert("Error en la configuración del servidor.");
      return;
    }

    if (password === GLOBAL_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-green-300">
        <h1 className="text-lg font-bold mb-2">Ingresa la contraseña</h1>
        <input
          type="password"
          className="p-2 text-black rounded-md mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="p-2 bg-green-500 text-black rounded-md" onClick={handlePasswordSubmit}>
          Acceder
        </button>
      </div>
    );
  }

  // Si pasa la contraseña, se muestra el Dashboard
  return <Dashboard />;
}

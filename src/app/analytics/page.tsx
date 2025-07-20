"use client";

import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-300 px-4">
        <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", border: "1px solid #4ade80" }}>
          <LayoutDashboard className="h-5 w-5 text-green-400"/>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-green-400 text-center text-neon-pink" >
            Dashboard VTG
          </h1>
        </div>
      </div>

      {/* Contenedor del login */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePasswordSubmit();
        }}
        className="w-full max-w-sm p-6 bg-gray-900 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Ingresa la contraseña</h2>

        <label htmlFor="password" className="block mb-2 text-sm font-medium text-green-200">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-2 mb-4 rounded-md bg-gray-800 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition duration-200"
        >
          Acceder
        </button>
      </form>
    </div>
    );
  }

  // Si pasa la contraseña, se muestra el Dashboard
  return <Dashboard />;
}

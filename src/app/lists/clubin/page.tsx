"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_CLUBIN_TSS; // Definir la contraseña global aquí

export default function ClubInPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const handlePasswordSubmit = () => {
    // Verifica si la contraseña global está definida
    if (!GLOBAL_PASSWORD) {
      console.error("La contraseña global no está configurada.");
      alert("Error en la configuración del servidor.");
      return;
    }

    // Compara la contraseña ingresada con la global
    if (password === GLOBAL_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };
  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/lists/clubin");
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-300 px-4">
        <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", border: "1px solid #4ade80" }}>
          <LayoutDashboard className="h-5 w-5 text-green-400"/>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-green-400 text-center text-neon-pink" >
            Dashboard VTG CLUBIN
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

  if (isLoading) return (
  <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
    <div className="animate-pulse">Cargando datos, por favor espera...</div>
  </div>
  )
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <h1 className="text-lg font-bold mb-2 text-yellow-300 border-b border-yellow-500">Club In - Pre Assessment Slots</h1>
      {data?.map((slot: { day_of_week: string; start_time: string; capacity: number; participants: any[] }) => (
        <div key={`${slot.day_of_week}-${slot.start_time}`} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
          <h2 className="text-md font-semibold mb-1 text-cyan-400">{slot.day_of_week} - {slot.start_time}</h2>
          <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {slot.participants.length}</span>
          </div>
          <p className="text-xs text-yellow-400">Capacidad: {slot.capacity}</p>
          <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
            <thead>
              <tr className="bg-gray-700 text-yellow-300">
                <th className="border border-green-500 px-2 py-1">Correo</th>
                <th className="border border-green-500 px-2 py-1">ID Grupo</th>
                <th className="border border-green-500 px-2 py-1">Asesor</th>
              </tr>
            </thead>
            <tbody>
              {slot.participants.map((participant: { correo: string; id_grupo: number; asesor?: string }) => (
                <tr key={participant.correo} className="hover:bg-gray-800">
                  <td className="border border-green-500 px-2 py-1">{participant.correo}</td>
                  <td className="border border-green-500 px-2 py-1">{participant.id_grupo}</td>
                  <td className="border border-green-500 px-2 py-1">{participant.asesor || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_NOVA_TSS; // Definir la contraseña global aquí


export default function NovaPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const handlePasswordSubmit = () => {
    // Verifica si la contraseña global está definida

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
        const response = await fetch("/api/lists/nova");
        const result = await response.json();
        console.log(result)
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-purple-700 px-4">
        <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(107, 33, 168, 0.1)", border: "1px solid #6B21A8" }}>
          <LayoutDashboard className="h-5 w-5 text-purple-800"/>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-purple-800 text-center text-neon-pink" >
            Dashboard VTG NOVA
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

        <label htmlFor="password" className="block mb-2 text-sm font-medium text-purple-200">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-2 mb-4 rounded-md bg-gray-800 text-purple-300 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-500 text-black font-semibold rounded-md hover:bg-purple-400 transition duration-200"
        >
          Acceder
        </button>
      </form>
    </div>
    );
  }

  if (isLoading) return (
  <div className="p-4 text-purple-300 bg-gray-800 rounded-lg shadow-inner border border-purple-400 text-sm text-center">
    <div className="animate-pulse">Cargando datos, por favor espera...</div>
  </div>
  )
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  const groupedData = data?.reduce((acc: Record<string, any[]>, person: { charla: string; correo: string; nombre?: string; pregrado?: string; semestre?: string; asesor?: string }) => {
    if (!acc[person.charla]) acc[person.charla] = [];
    acc[person.charla].push(person);
    return acc;
  }, {});

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <h1 className="text-lg font-bold mb-2 text-yellow-300 border-b border-yellow-500">Nova - Charlas</h1>
      {Object.keys(groupedData || {}).map((charla) => (
        <div key={charla} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
          <h2 className="text-md font-semibold mb-1 text-cyan-400">{charla}</h2>
          <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {groupedData[charla].length}</span>
          </div>
          <table className="w-full border-collapse border border-green-500 text-xs text-green-200">
            <thead>
              <tr className="bg-gray-700 text-yellow-300">
                <th className="border border-green-500 px-2 py-1">Correo</th>
                <th className="border border-green-500 px-2 py-1">Nombre</th>
                <th className="border border-green-500 px-2 py-1">Pregrado</th>
                <th className="border border-green-500 px-2 py-1">Semestre</th>
                <th className="border border-green-500 px-2 py-1">Asesor</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[charla].map((person: { correo: string; nombre?: string; pregrado?: string; semestre?: string; asesor?: string }) => (
                <tr key={person.correo} className="hover:bg-gray-800">
                  <td className="border border-green-500 px-2 py-1">{person.correo}</td>
                  <td className="border border-green-500 px-2 py-1">{person.nombre || "N/A"}</td>
                  <td className="border border-green-500 px-2 py-1">{person.pregrado || "N/A"}</td>
                  <td className="border border-green-500 px-2 py-1">{person.semestre || "N/A"}</td>
                  <td className="border border-green-500 px-2 py-1">{person.asesor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
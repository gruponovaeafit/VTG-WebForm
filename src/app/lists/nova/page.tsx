"use client";

import { useEffect, useState } from "react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_NOVA_TSS; // Definir la contraseña global aquí


export default function NovaPage() {
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
        const response = await fetch("/api/lists/nova");
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

  if (isLoading) return <div className="p-2 text-sm text-green-300">Cargando datos...</div>;
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
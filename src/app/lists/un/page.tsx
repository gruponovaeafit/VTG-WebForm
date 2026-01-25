"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";
import { toast } from "react-toastify";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_UN_TSS;

export default function UnPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [groupByDate, setGroupByDate] = useState<boolean>(false);

  const handlePasswordSubmit = () => {
    if (!GLOBAL_PASSWORD) {
      console.error("La contraseña global no está configurada.");
      toast.error("Error en la configuración del servidor.", { position: "top-center", autoClose: 2000 });
      return;
    }

    if (password === GLOBAL_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast.error("Contraseña incorrecta", { position: "top-center", autoClose: 2000 });
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/lists/un");
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
            <LayoutDashboard className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-400 text-center">Dashboard VTG UN</h1>
          </div>
        </div>
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
            className="w-full p-2 mb-4 rounded-md bg-gray-800 text-green-300"
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

  if (isLoading)
    return (
      <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
        <div className="animate-pulse">Cargando datos, por favor espera...</div>
      </div>
    );
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
        <div>No hay datos disponibles.</div>
      </div>
    );
  }

  // Agrupar todos los participantes para vista alternativa
  const allParticipants = data.flatMap((item: any) => item.participants || []);

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">UN Dashboard</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-2 py-1 text-xs bg-green-500 text-black roundedpx-4 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition"
        >
          {groupByDate ? "Ver por charla" : "Listar todos los participantes"}
        </button>
      </div>

      {groupByDate ? (
        allParticipants.length > 0 ? (
          <div className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
            <h2 className="text-md font-semibold mb-1 text-cyan-400">Todos los participantes</h2>
            <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {allParticipants.length}</span>
            </div>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {allParticipants.map((p: any, i: number) => (
                  <tr key={`${p.correo}-${i}`} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{p.correo || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
            <div>No hay participantes registrados.</div>
          </div>
        )
      ) : (
        data.map((charla: { charla: string; participants: any[] }) => {
          const participantesArray = charla.participants || [];
          return (
            <div key={charla.charla} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
              <h2 className="text-md font-semibold mb-1 text-cyan-400">{charla.charla || "Sin charla"}</h2>
              <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
                <Users className="h-5 w-5 text-green-500" />
                <span>Participantes: {participantesArray.length}</span>
              </div>
              <table className="w-full border-collapse border border-green-500 text-xs text-green-200">
                <thead>
                  <tr className="bg-gray-700 text-yellow-300">
                    <th className="border border-green-500 px-2 py-1">Correo</th>
                    <th className="border border-green-500 px-2 py-1">Nombre</th>
                    <th className="border border-green-500 px-2 py-1">Pregrado</th>
                    <th className="border border-green-500 px-2 py-1">Semestre</th>
                    <th className="border border-green-500 px-2 py-1">Comité</th>
                  </tr>
                </thead>
                <tbody>
                  {participantesArray.map((p: any, idx: number) => (
                    <tr key={`${p.correo}-${idx}`} className="hover:bg-gray-800">
                      <td className="border border-green-500 px-2 py-1">{p.correo || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.comite || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}

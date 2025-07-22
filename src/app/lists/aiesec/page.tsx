"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_AIESEC_TSS;

export default function AiesecPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [groupByDate, setGroupByDate] = useState<boolean>(false);

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

  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/lists/aiesec");
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
            <h1 className="text-4xl font-bold text-green-400 text-center text-neon-pink">
              Dashboard VTG AIESEC
            </h1>
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
  );
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  const allParticipants = data?.flatMap((group: any) =>
    group.participants.map((p: any) => ({ ...p, id_grupo: group.id_grupo }))
  );

  const groupedByDate: Record<string, any[]> = {};
  allParticipants?.forEach((p: { fecha_inscripcion: string | number | Date; }) => {
    const date = p.fecha_inscripcion ? new Date(p.fecha_inscripcion).toLocaleDateString() : "Sin fecha";
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(p);
  });

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">AIESEC - Grupos</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-4 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition"
        >
          {groupByDate ? "Agrupar por grupo" : "Agrupar por fecha de inscripción"}
        </button>
      </div>

      {groupByDate ? (
        Object.entries(groupedByDate)
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, participants]) => (
            <div key={date} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
              <h2 className="text-md font-semibold mb-1 text-cyan-400">{date}</h2>
              <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
                <thead>
                  <tr className="bg-gray-700 text-yellow-300">
                    <th className="border border-green-500 px-2 py-1">Correo</th>
                    <th className="border border-green-500 px-2 py-1">Nombre</th>
                    <th className="border border-green-500 px-2 py-1">Pregrado</th>
                    <th className="border border-green-500 px-2 py-1">Semestre</th>
                    <th className="border border-green-500 px-2 py-1">Teléfono</th>
                    <th className="border border-green-500 px-2 py-1">Grupo</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr key={`${p.correo}-${idx}`} className="hover:bg-gray-800">
                      <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                      <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.telefono || "N/A"}</td>
                      <td className="border border-green-500 px-2 py-1">{p.id_grupo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
      ) : (
        data?.map((group: { id_grupo: number; participants: any[] }) => (
          <div key={group.id_grupo} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
            <h2 className="text-md font-semibold mb-1 text-cyan-400">Grupo {group.id_grupo}</h2>
            <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {group.participants.length}</span>
            </div>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                  <th className="border border-green-500 px-2 py-1">Pregrado</th>
                  <th className="border border-green-500 px-2 py-1">Semestre</th>
                  <th className="border border-green-500 px-2 py-1">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {group.participants.map((participant: { correo: string; nombre?: string; pregrado?: string; semestre?: string; telefono?: string }) => (
                  <tr key={participant.correo} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{participant.correo}</td>
                    <td className="border border-green-500 px-2 py-1">{participant.nombre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{participant.pregrado || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{participant.semestre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{participant.telefono || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

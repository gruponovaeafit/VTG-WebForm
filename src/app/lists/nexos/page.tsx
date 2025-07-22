"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_NEXOS_TSS;

export default function NexosPage() {
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
        const response = await fetch("/api/lists/nexos");
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

  const groupParticipantsByDate = (participants: any[]) => {
    const grouped: Record<string, any[]> = {};
    participants.forEach((p) => {
      const date = p.fecha_inscripcion?.split("T")[0] || "Sin fecha";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    return grouped;
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-300 px-4">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", border: "1px solid #4ade80" }}>
            <LayoutDashboard className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-400 text-center text-neon-pink">
              Dashboard VTG NEXOS
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

  if (isLoading)
    return (
      <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
        <div className="animate-pulse">Cargando datos, por favor espera...</div>
      </div>
    );
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">Nexos - Departamentos</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-3 py-1 bg-green-700 text-sm rounded hover:bg-green-600"
        >
          {groupByDate ? "Agrupar por departamento" : "Agrupar por fecha de inscripción"}
        </button>
      </div>

      {!groupByDate &&
        data?.map((departamento: { departamento: string; participants: any[] }) => (
          <div key={departamento.departamento} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
            <h2 className="text-md font-semibold mb-1 text-cyan-400">{departamento.departamento}</h2>
            <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {departamento.participants.length}</span>
            </div>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                  <th className="border border-green-500 px-2 py-1">Pregrado</th>
                  <th className="border border-green-500 px-2 py-1">Semestre</th>
                  <th className="border border-green-500 px-2 py-1">Charla Informativa</th>
                  <th className="border border-green-500 px-2 py-1">Justificación</th>
                </tr>
              </thead>
              <tbody>
                {departamento.participants.map((p: any) => (
                  <tr key={`${p.correo}-${p.id_grupo}`} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.charla_informativa ? "Sí" : "No"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.justificacion || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {groupByDate &&
        (() => {
          const allParticipants = data.flatMap((d: any) => d.participants);
          const groupedByDate = groupParticipantsByDate(allParticipants);
          return Object.entries(groupedByDate).map(([date, participants]) => (
            <div key={date} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
              <h2 className="text-md font-semibold mb-1 text-cyan-400">Inscritos el {date}</h2>
              <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
                <Users className="h-5 w-5 text-green-500" />
                <span>Participantes: {participants.length}</span>
              </div>
              <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
                <thead>
                  <tr className="bg-gray-700 text-yellow-300">
                    <th className="border border-green-500 px-2 py-1">Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p: any) => (
                    <tr key={`${p.correo}-${p.id_grupo}`} className="hover:bg-gray-800">
                      <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ));
        })()}
    </div>
  );
}

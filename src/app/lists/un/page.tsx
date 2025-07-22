"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

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

  const groupParticipantsByDate = (data: any[]) => {
    const grouped: { [fecha: string]: any[] } = {};
    data.forEach((charla) => {
      charla.participants.forEach((p: any) => {
        const fecha = p.fecha_inscripcion?.split("T")[0] || "Sin fecha";
        if (!grouped[fecha]) grouped[fecha] = [];
        grouped[fecha].push(p);
      });
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

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">UN - Charlas</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 text-black font-semibold rounded"
        >
          {groupByDate ? "Ver por charla" : "Ver por fecha"}
        </button>
      </div>

      {groupByDate ? (
        Object.entries(groupParticipantsByDate(data)).map(([fecha, participants]: any) => (
          <div key={fecha} className="mb-4 border border-yellow-500 rounded-lg p-2 bg-gray-900">
            <h2 className="text-md font-semibold mb-2 text-cyan-400">Inscritos en {fecha}</h2>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                  <th className="border border-green-500 px-2 py-1">Pregrado</th>
                  <th className="border border-green-500 px-2 py-1">Semestre</th>
                  <th className="border border-green-500 px-2 py-1">Departamentos</th>
                  <th className="border border-green-500 px-2 py-1">Asistencia Assessment</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p: any) => (
                  <tr key={`${p.correo}-${p.id_grupo}`} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.departamentos || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.asis_assessment || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        data?.map((charla: { charla_info: string; participants: any[] }) => (
          <div key={charla.charla_info} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
            <h2 className="text-md font-semibold mb-1 text-cyan-400">
              {charla.charla_info ==   "1" ? "Asiste a la charla" : "No asiste a la charla"}
            </h2>
            <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {charla.participants.length}</span>
            </div>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                  <th className="border border-green-500 px-2 py-1">Pregrado</th>
                  <th className="border border-green-500 px-2 py-1">Semestre</th>
                  <th className="border border-green-500 px-2 py-1">Departamentos</th>
                  <th className="border border-green-500 px-2 py-1">Asistencia Assessment</th>
                </tr>
              </thead>
              <tbody>
                {charla.participants.map((p: any) => (
                  <tr key={`${p.correo}-${p.id_grupo}`} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.departamentos || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.asis_assessment || "N/A"}</td>
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

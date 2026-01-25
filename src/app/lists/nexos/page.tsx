"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";
import ExportCSV from "@/app/globalcomponents/UI/ExportCSV";

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
        console.log("📊 Datos recibidos de nexos:", result);
        if (result.success && result.data) {
          setData(result.data);
        } else {
          console.error("❌ Formato de datos inesperado:", result);
          setData([]);
        }
      } catch (err) {
        console.error("❌ Error al obtener datos:", err);
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

  // Verificar que data existe y es un array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
        <div>No hay datos disponibles.</div>
      </div>
    );
  }

  // Agrupar por charla (vista por defecto) - data ya viene agrupado del API
  const groupedByCharla = data.reduce((acc: Record<string, any[]>, item: any) => {
    if (item.charla && item.participants) {
      if (!acc[item.charla]) acc[item.charla] = [];
      acc[item.charla].push(...item.participants);
    }
    return acc;
  }, {});

  // Agrupar todos los participantes para vista alternativa
  const allParticipants = data.flatMap((item: any) => item.participants || []);

  // Debug: mostrar estructura de datos
  console.log("📊 Data structure:", data);
  console.log("📊 Grouped by charla:", groupedByCharla);
  console.log("📊 All participants:", allParticipants);

  const exportAllData = data.flatMap((item: any) =>
  (item.participants || []).map((p: any) => ({
    charla: item.charla ?? "Sin charla",
    correo: p.correo,
    nombre: p.nombre,
    pregrado: p.pregrado ?? "N/A",
    semestre: p.semestre ?? "N/A",
    miembro: p.nombre_miembro,
  }))
);


  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">Nexos Dashboard</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-4 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition"
        >
          {groupByDate ? "Agrupar por charla" : "Listar todos los participantes"}
        </button>
      </div>

      {groupByDate ? (
        allParticipants.length > 0 ? (
          <div className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
            <h2 className="text-md font-semibold mb-1 text-cyan-400">Todos los participantes</h2>
            <ExportCSV
  data={exportAllData}
  filename="nexos_todos.csv"
  columns={[
    { header: "Charla", accessor: (r) => r.charla },
    { header: "Correo", accessor: (r) => r.correo },
    { header: "Nombre", accessor: (r) => r.nombre },
    { header: "Pregrado", accessor: (r) => r.pregrado },
    { header: "Semestre", accessor: (r) => r.semestre },
    { header: "Miembro", accessor: (r) => r.miembro },
  ]}
/>

            <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
              <Users className="h-5 w-5 text-green-500" />
              <span>Participantes: {allParticipants.length}</span>
            </div>
            <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
              <thead>
                <tr className="bg-gray-700 text-yellow-300">
                  <th className="border border-green-500 px-2 py-1">Correo</th>
                  <th className="border border-green-500 px-2 py-1">Nombre</th>
                  <th className="border border-green-500 px-2 py-1">Nombre del Miembro</th>
                </tr>
              </thead>
              <tbody>
                {allParticipants.map((p: any, i: number) => (
                  <tr key={`${p.correo}-${i}`} className="hover:bg-gray-800">
                    <td className="border border-green-500 px-2 py-1">{p.correo || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                    <td className="border border-green-500 px-2 py-1">{p.nombre_miembro || "N/A"}</td>
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
        Object.keys(groupedByCharla).length > 0 ? (
          Object.entries(groupedByCharla).map(([charla, participantes]) => {
            const participantesArray = participantes as any[];
            return (
              <div key={charla} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
                <h2 className="text-md font-semibold mb-1 text-cyan-400">{charla || "Sin charla"}</h2>
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
                      <th className="border border-green-500 px-2 py-1">Nombre del Miembro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantesArray.map((participant: any, idx: number) => (
                      <tr key={`${participant.correo}-${idx}`} className="hover:bg-gray-800">
                        <td className="border border-green-500 px-2 py-1">{participant.correo || "N/A"}</td>
                        <td className="border border-green-500 px-2 py-1">{participant.nombre || "N/A"}</td>
                        <td className="border border-green-500 px-2 py-1">{participant.pregrado || "N/A"}</td>
                        <td className="border border-green-500 px-2 py-1">{participant.semestre || "N/A"}</td>
                        <td className="border border-green-500 px-2 py-1">{participant.nombre_miembro || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center">
            <div>No hay participantes registrados.</div>
          </div>
        )
      )}
    </div>
  );
}

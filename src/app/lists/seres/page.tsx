"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users } from "lucide-react";

const GLOBAL_PASSWORD = process.env.NEXT_PUBLIC_SERES_TSS;

export default function SeresPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [groupByDate, setGroupByDate] = useState(false); // NUEVO

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
        const response = await fetch("/api/lists/seres");
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

  const groupByFecha = () => {
    const agrupado: Record<string, any[]> = {};
    data?.forEach((grupo: any) => {
      grupo.participants.forEach((p: any) => {
        const fecha = p.fecha_inscripcion?.split("T")[0] || "Sin fecha";
        if (!agrupado[fecha]) agrupado[fecha] = [];
        agrupado[fecha].push(p);
      });
    });

    return Object.entries(agrupado).map(([fecha, participants]) => ({
      fecha,
      participants,
    }));
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
              Dashboard VTG SERES
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

  if (isLoading) return <div className="p-4 text-green-300 bg-gray-800 rounded-lg shadow-inner border border-green-400 text-sm text-center"><div className="animate-pulse">Cargando datos, por favor espera...</div></div>;
  if (error) return <div className="p-2 text-sm text-red-400">Error al cargar los datos.</div>;

  const renderGroups = () => {
    const dataToRender = groupByDate ? groupByFecha() : data;

    return dataToRender?.map((group: any) => {
      const title = groupByDate ? `Fecha de inscripción: ${group.fecha}` : group.charla_info;
      let contador = 1;

      return (
        <div key={title} className="mb-4 border border-yellow-500 rounded-lg p-2 shadow-lg text-sm bg-gray-900">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-md font-semibold text-cyan-400">{title}</h2>
          </div>
          <div className="flex items-center gap-2 text-lg text-green-400 mb-4 pb-3 border-b border-gray-700">
            <Users className="h-5 w-5 text-green-500" />
            <span>Participantes: {group.participants.length}</span>
          </div>
          <table className="w-full border-collapse border border-green-500 text-xs text-green-200 mt-2">
            <thead>
              <tr className="bg-gray-700 text-yellow-300">
                <th className="border border-green-500 px-2 py-1">#</th>
                <th className="border border-green-500 px-2 py-1">Correo</th>
                <th className="border border-green-500 px-2 py-1">Nombre</th>
                <th className="border border-green-500 px-2 py-1">Pregrado</th>
                <th className="border border-green-500 px-2 py-1">Semestre</th>
              </tr>
            </thead>
            <tbody>
              {group.participants.map((p: any) => (
                <tr key={`${p.correo}-${p.id_grupo}`} className="hover:bg-gray-800">
                  <td className="border border-green-500 px-2 py-1">{contador++}</td>
                  <td className="border border-green-500 px-2 py-1">{p.correo}</td>
                  <td className="border border-green-500 px-2 py-1">{p.nombre || "N/A"}</td>
                  <td className="border border-green-500 px-2 py-1">{p.pregrado || "N/A"}</td>
                  <td className="border border-green-500 px-2 py-1">{p.semestre || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  };

  return (
    <div className="p-2 h-screen overflow-auto bg-black text-green-300 font-mono">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-yellow-300 border-b border-yellow-500">Seres - Charlas</h1>
        <button
          onClick={() => setGroupByDate(!groupByDate)}
          className="px-3 py-1 text-xs bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
        >
          {groupByDate ? "Ver por charla" : "Ver por fecha de inscripción"}
        </button>
      </div>
      {renderGroups()}
    </div>
  );
}

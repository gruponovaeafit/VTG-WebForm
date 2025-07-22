"use client";

import { useEffect, useState } from "react";
import { Crown, TrendingUp, Users } from "lucide-react";

export default function TopGroup() {
  const [topGroup, setTopGroup] = useState<{ grupo: string; cantidad: number } | null>(null);

  // Función para obtener el grupo con más inscritos
  const fetchTopGroup = async () => {
    try {
      const response = await fetch("/api/analytics/top-group");
      const data = await response.json();
      setTopGroup(data);
    } catch (error) {
      console.error("Error obteniendo el grupo con más inscritos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchTopGroup();

    // Intervalo cada 5 segundos para refrescar la data
    const interval = setInterval(() => {
      fetchTopGroup();
    }, 5000);

    // Limpiamos el intervalo cuando se desmonte el componente
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="p-6 rounded-xl shadow-xl text-center border border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[200px]" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
    <div className="flex items-center justify-center mb-4">
      <Crown className="h-6 w-6 mr-2" style={{ color: "#FF00FF" }} />
      <h2 className="text-xl font-bold" style={{ color: "#FF00FF" }}>
        Grupo con más inscritos
      </h2>
    </div>

    <div className="flex-1 flex flex-col justify-center space-y-2">
      {topGroup ? (
        <>
          <div className="flex items-center justify-center">
            <p className="text-3xl font-extrabold tracking-tight" style={{ color: "#00FFFF" }}>
              {topGroup.grupo}
            </p>
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-full border mx-auto" style={{ borderColor: "#00FFFF", backgroundColor: "rgba(0, 255, 255, 0.1)" }}>
            <Users className="h-4 w-4 mr-1" style={{ color: "#00FFFF" }} />
            <span className="text-sm font-medium" style={{ color: "#00FFFF" }}>
              {topGroup.cantidad} inscritos
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center">
            <p className="text-3xl font-extrabold tracking-tight animate-pulse" style={{ color: "#00FFFF" }}>
              ---
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: "#00FFFF" }}></div>
            <p className="text-sm animate-pulse" style={{ color: "#FFFFFF" }}>
              Cargando datos...
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

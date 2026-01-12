"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { GraduationCap, Activity, Users, TrendingUp } from "lucide-react";

interface SemesterData {
  semestre: number;
  cantidad: number;
}

export default function StudentsBySemester() {
  const [data, setData] = useState<SemesterData[]>([]);

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/semester");
      const result: SemesterData[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchData();

    // Intervalo que repite la llamada cada 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Al desmontar el componente, limpiamos el intervalo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-[#000072]">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: "1px solid #FE9A02" }}>
          <GraduationCap className="h-4 w-4" style={{ color: "#FE9A02" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            Inscritos por Semestre
          </h2>
        </div>
      </div>

      {/* Estadísticas académicas */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Semestre con Mayor Participación</p>
          <p className="text-lg font-bold" style={{ color: "#FE9A02" }}>
            {data.length > 0 ? data.reduce((max, item) => item.cantidad > max.cantidad ? item : max, data[0])?.semestre : "N/A"}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Promedio</p>
          <p className="text-lg font-bold" style={{ color: "#FE9A02" }}>
            {(() => {
              if (data.length === 0) return 0;
              const total = data.reduce((sum, item) => sum + Number(item.cantidad), 0);
              const promedio = total / data.length;
              return promedio % 1 === 0 ? Math.round(promedio) : promedio.toFixed(1);
            })()}
          </p>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4"
                style={{ borderColor: "#FE9A02" }}></div>
            <p style={{ color: "#FFFFFF" }}>Cargando datos del gráfico...</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={435}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
            <XAxis dataKey="semestre" stroke="#FFFFFF " tick={{ fill: "#FFFFFF", fontSize: 14 }} />
            <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF", fontSize: 14 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222222", borderColor: "#FE9A02", color: "#FFFFFF" }}
            />
            <Bar dataKey="cantidad" fill="#FE9A02">
              <LabelList dataKey="cantidad" position="top" fill="#FFFFFF" fontSize={14} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

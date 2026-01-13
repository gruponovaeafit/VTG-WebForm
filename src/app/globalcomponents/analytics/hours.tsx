"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface HourData {
  hora: number;
  cantidad: number;
}

export default function UsersByHourCurve() {
  const [data, setData] = useState<HourData[]>([]);

  // Función para obtener la data
  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/hours");
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result: HourData[] = await response.json();
      console.log("Datos de horas recibidos:", result);
      // Asegurar que result sea un array
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error("La respuesta no es un array:", result);
        setData([]);
      }
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      setData([]);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchData();

    // Intervalo de 5 segundos para actualizar periódicamente
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-[#000072]">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: "1px solid #FE9A02" }}>
          <Clock className="h-4 w-4" style={{ color: "#FE9A02" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            Inscritos por Hora
          </h2>
        </div>
      </div>

      {/* Estadísticas de tiempo */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Hora Pico</p>
          <p className="text-lg font-bold" style={{ color: "#FE9A02" }}>
            {data.length > 0 ? `${data.reduce((max, item) => Number(item.cantidad) > Number(max.cantidad) ? item : max, data[0])?.hora}:00` : "N/A"}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Promedio/Hora</p>
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
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
            <XAxis
              dataKey="hora"
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 14 }}
              tickFormatter={(tick) => `${tick}:00`}
            />
            <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF", fontSize: 14 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222222", borderColor: "#00FFFF", color: "#FFFFFF" }}
              labelFormatter={(label) => `Hora: ${label}:00`}
            />
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke="#FE9A02"
              strokeWidth={2}
              dot={{ r: 6, fill: "#FE9A02" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

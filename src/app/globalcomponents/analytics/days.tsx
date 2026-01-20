"use client";

import { useEffect, useState } from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
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

interface DateData {
  fecha: string;
  cantidad: number;
}

export default function UsersByDate() {
  const [data, setData] = useState<DateData[]>([]);

  // Función para obtener los datos desde la API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/days");
      const result: DateData[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchData();

    // Intervalo cada 5 segundos para actualizar los datos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpieza: detener el intervalo cuando se desmonte el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-[#000072]">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: "1px solid #FE9A02" }}>
          <Calendar className="h-4 w-4" style={{ color: "#FE9A02" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            Inscritos por Día
          </h2>
        </div>
      </div>

      {/* Indicador de período */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FE9A02" }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-75" style={{ backgroundColor: "#FE9A02" }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-150" style={{ backgroundColor: "#FE9A02" }}></div>
        </div>
        <span className="text-xs" style={{ color: "#FE9A02" }}>
          {data.length} días registrados
        </span>
      </div>

      {/* Estadísticas diarias */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Mejor Día</p>
          <p className="text-sm font-bold" style={{ color: "#FE9A02" }}>
            {(() => {
              if (!Array.isArray(data) || data.length === 0) return 0;

              let max = typeof data[0]?.cantidad === 'number' ? data[0].cantidad : 0;

              for (let i = 1; i < data.length; i++) {
                const item = data[i];
                if (item && typeof item.cantidad === 'number' && item.cantidad > max) {
                  max = item.cantidad;
                }
              }

              return max;
            })()}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: "#FFFFFF" }}>Promedio Diario</p>
          <p className="text-lg font-bold" style={{ color: "#FE9A02" }}>
            {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.cantidad, 0) / data.length) : 0}
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
        <ResponsiveContainer width="100%" height={416}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
            <XAxis
              dataKey="fecha"
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 14 }}
              tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            />
            <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF", fontSize: 14 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222222", borderColor: "#FE9A02", color: "#FFFFFF" }}
              labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString()}`}
            />
            <Line type="monotone" dataKey="cantidad" stroke="#FE9A02" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

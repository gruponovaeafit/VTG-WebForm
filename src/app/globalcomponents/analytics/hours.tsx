"use client";

import { useEffect, useState } from "react";
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
      const result: HourData[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
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
    <div
      className="p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "#FF00FF" }}
      >
        Usuarios por Hora de Inscripción
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
          <XAxis
            dataKey="hora"
            stroke="#00FFFF"
            tick={{ fill: "#00FFFF", fontSize: 14 }}
            tickFormatter={(tick) => `${tick}:00`}
          />
          <YAxis stroke="#00FFFF" tick={{ fill: "#00FFFF", fontSize: 14 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#222222", borderColor: "#00FFFF", color: "#FFFFFF" }}
            labelFormatter={(label) => `Hora: ${label}:00`}
          />
          <Legend wrapperStyle={{ color: "#FFFFFF" }} />
          <Line
            type="monotone"
            dataKey="cantidad"
            stroke="#FF0080"
            strokeWidth={2}
            dot={{ r: 6, fill: "#FF0080" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

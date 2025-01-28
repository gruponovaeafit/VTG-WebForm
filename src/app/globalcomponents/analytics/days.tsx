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

interface DateData {
  fecha: string;
  cantidad: number;
}

export default function UsersByDate() {
  const [data, setData] = useState<DateData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/days");
        const result: DateData[] = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#FF00FF" }}>Usuarios por Fecha de Creación</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            stroke="#00FFFF"
            tick={{ fill: "#00FFFF", fontSize: 14 }}
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          />
          <YAxis stroke="#00FFFF" tick={{ fill: "#00FFFF", fontSize: 14 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#222222", borderColor: "#00FFFF", color: "#FFFFFF" }}
            labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString()}`}
          />
          <Legend wrapperStyle={{ color: "#FFFFFF" }} />
          <Line type="monotone" dataKey="cantidad" stroke="#FF0080" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

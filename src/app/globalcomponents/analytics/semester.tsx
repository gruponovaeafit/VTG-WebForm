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
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#FF00FF" }}>
        Estudiantes por Semestre
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#555555" strokeDasharray="3 3" />
          <XAxis dataKey="semestre" stroke="#00FFFF" tick={{ fill: "#00FFFF", fontSize: 14 }} />
          <YAxis stroke="#00FFFF" tick={{ fill: "#00FFFF", fontSize: 14 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#222222", borderColor: "#00FFFF", color: "#FFFFFF" }}
          />
          <Bar dataKey="cantidad" fill="#FF0080">
            <LabelList dataKey="cantidad" position="top" fill="#FFFFFF" fontSize={14} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

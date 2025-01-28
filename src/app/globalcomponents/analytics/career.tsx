"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

interface DataItem {
  pregrado: string;
  cantidad: number;
}

// 🎨 Definir colores en variables para personalización rápida
const COLORS = {
  background: "#000000",
  text: "#FFFFFF",
  title: "#FF00FF",
  bar: "#FF0080",
  grid: "#555555",
  axis: "#00FFFF",
  tooltipBackground: "#222222",
  tooltipBorder: "#00FFFF",
  tooltipText: "#FFFFFF",
  legend: "#FFFF00",
  label: "#FFFFFF"
};

export default function UsersByDegreeChart() {
  const [data, setData] = useState<DataItem[]>([]);

  // Función para obtener la data desde la API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/undergrad");
      const result: DataItem[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchData();

    // Intervalo cada 5 segundos para actualizar la data
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpieza del intervalo cuando se desmonte el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: COLORS.background, color: COLORS.text }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: COLORS.title }}
      >
        Usuarios por Carrera
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="pregrado"
            stroke={COLORS.axis}
            tick={{ fill: COLORS.axis, fontSize: 14 }}
          />
          <YAxis
            stroke={COLORS.axis}
            tick={{ fill: COLORS.axis, fontSize: 14 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.tooltipBackground,
              borderColor: COLORS.tooltipBorder,
              color: COLORS.tooltipText
            }}
            labelStyle={{ color: COLORS.tooltipText }}
          />
          <Legend wrapperStyle={{ color: COLORS.legend }} />
          <Bar dataKey="cantidad" fill={COLORS.bar}>
            <LabelList
              dataKey="cantidad"
              position="top"
              fill={COLORS.label}
              fontSize={14}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

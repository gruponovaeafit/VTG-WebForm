"use client";

import { useEffect, useState } from "react";
import {Users} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

interface GroupData {
  grupo: string;
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

export default function GroupInscriptionsChart() {
  const [data, setData] = useState<GroupData[]>([]);

  // Función para obtener los datos desde la API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/groups");
      const result: GroupData[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchData();

    // Intervalo para volver a hacer la llamada cada 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: `1px solid ${COLORS.title}` }}>
          <Users className="h-4 w-4" style={{ color: COLORS.title }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: COLORS.title }}>
            Inscritos por Grupo Estudiantil
          </h2>
        </div>
      </div>

      {/* Indicador de grupos */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.axis }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-75" style={{ backgroundColor: COLORS.axis }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-150" style={{ backgroundColor: COLORS.axis }}></div>
        </div>
        <span className="text-xs" style={{ color: COLORS.axis }}>
          {data.length} grupos activos
        </span>
      </div>

      {/* Estadísticas de grupos */}
      <div className="grid grid-cols-1 gap-1 mb-2">
        <div className="text-center p-1 rounded-lg border" style={{ borderColor: COLORS.grid, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: COLORS.text }}>Promedio/Grupo</p>
          <p className="text-lg font-bold" style={{ color: COLORS.axis }}>
            {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.cantidad, 0) / data.length) : 0}
          </p>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4"
                style={{ borderColor: "#00FFFF" }}></div>
            <p style={{ color: "#FFFFFF" }}>Cargando datos del gráfico...</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="grupo"
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
      )}
    </div>
  );
}

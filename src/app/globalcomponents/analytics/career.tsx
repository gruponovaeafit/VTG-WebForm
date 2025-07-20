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

import {BarChart3} from "lucide-react"

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

  const abreviaturas: { [key: string]: string } = {
    "Administración de Negocios": "Adm. Negocios",
    "Biología": "Biología",
    "Ciencias Políticas": "C. Políticas",
    "Comunicación Social": "Com. Social",
    "Contaduría Pública": "Contaduría",
    "Derecho": "Derecho",
    "Diseño Interactivo": "D. Interactivo",
    "Diseño Urbano y Gestión del Hábitat": "D. Urbano y Hábitat",
    "Economía": "Economía",
    "Finanzas": "Finanzas",
    "Geología": "Geología",
    "Ingeniería Agronómica": "Ing. Agronómica",
    "Ingeniería Civil": "Ing. Civil",
    "Ingeniería de Diseño de Producto": "Ing. Diseño Producto",
    "Ingeniería de Procesos": "Ing. Procesos",
    "Ingeniería de Producción": "Ing. Producción",
    "Ingeniería de Sistemas": "Ing. Sistemas",
    "Ingeniería Física": "Ing. Física",
    "Ingeniería Matemática": "Ing. Matemática",
    "Ingeniería Mecánica": "Ing. Mecánica",
    "Literatura": "Literatura",
    "Mercadeo": "Mercadeo",
    "Música": "Música",
    "Negocios Internacionales": "Neg. Internacionales",
    "Psicología": "Psicología"
  };

let totalInscritosCarrera = 0;
let topCarrera = null;
let maxCantidad = -Infinity;

for (let i = 0; i < data.length; i++) {
  const item = data[i];
  totalInscritosCarrera += item.cantidad;

  if (item.cantidad > maxCantidad) {
    maxCantidad = item.cantidad;
    topCarrera = item;
  }
}

const promedioPorCarrera = data.length > 0
  ? Math.round(totalInscritosCarrera / data.length)
  : 0;

  const Porcentaje: Array<DataItem & { porcentaje: string }> = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const porcentaje = totalInscritosCarrera > 0
        ? ((item.cantidad / totalInscritosCarrera) * 100).toFixed(2)
        : "0.00";

      Porcentaje.push({
        ...item,
        porcentaje
      });
    });
  }

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
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: `1px solid ${COLORS.title}` }}>
          <BarChart3 className="h-4 w-4" style={{ color: COLORS.title }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: COLORS.title }}>
            Inscritos por Carrera
          </h2>
        </div>
      </div>

      {/* Indicador de carreras */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.axis }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-75" style={{ backgroundColor: COLORS.axis }}></div>
          <div
            className="w-2 h-2 rounded-full animate-pulse delay-150"
            style={{ backgroundColor: COLORS.axis }}
          ></div>
        </div>
        <span className="text-xs" style={{ color: COLORS.axis }}>
          {data.length} carreras activas
        </span>
      </div>

      {/* Estadísticas de carrera */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="text-center p-2 rounded-lg border w-full max-w-[200px]" style={{ borderColor: COLORS.grid, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: COLORS.text }}>
            Carrera Líder
          </p>
          <p className="text-xs font-bold" style={{ color: COLORS.bar }}>
            {topCarrera ? abreviaturas[topCarrera.pregrado] || topCarrera.pregrado : "N/A"}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: COLORS.grid, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: COLORS.text }}>
            Promedio
          </p>
          <p className="text-lg font-bold" style={{ color: COLORS.axis }}>
            {promedioPorCarrera}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg border" style={{ borderColor: COLORS.grid, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-xs opacity-75" style={{ color: COLORS.text }}>
            % Líder
          </p>
          <p className="text-sm font-bold" style={{ color: COLORS.bar }}>
            {topCarrera ? `${Porcentaje.find(item => item.pregrado === topCarrera.pregrado)?.porcentaje ?? "0.00"}%` : "N/A"}
          </p>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4"
                style={{ borderColor: COLORS.axis }}></div>
            <p style={{ color: COLORS.text }}>Cargando datos del gráfico...</p>
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

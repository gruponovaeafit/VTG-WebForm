"use client";

import { useEffect, useState } from "react";

export default function TopGroup() {
  const [topGroup, setTopGroup] = useState<{ grupo: string; cantidad: number } | null>(null);

  useEffect(() => {
    const fetchTopGroup = async () => {
      try {
        const response = await fetch("/api/analytics/top-group");
        const data = await response.json();
        setTopGroup(data);
      } catch (error) {
        console.error("Error obteniendo el grupo con más inscritos:", error);
      }
    };

    fetchTopGroup();
  }, []);

  return (
    <div className="p-4 rounded-lg shadow-lg text-center" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
      <h2 className="text-xl font-bold" style={{ color: "#FF00FF" }}>Grupo con más inscritos</h2>
      {topGroup ? (
        <p className="text-2xl font-extrabold" style={{ color: "#00FFFF" }}>
          {topGroup.grupo} ({topGroup.cantidad})
        </p>
      ) : (
        <p className="text-lg" style={{ color: "#FFFFFF" }}>Cargando...</p>
      )}
    </div>
  );
}

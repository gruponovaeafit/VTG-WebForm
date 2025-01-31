"use client";

import { useEffect, useState } from "react";

export default function TopGroup() {
  const [topGroup, setTopGroup] = useState<{ grupo: string; cantidad: number } | null>(null);

  // Función para obtener el grupo con más inscritos
  const fetchTopGroup = async () => {
    try {
      const response = await fetch("/api/analytics/top-group");
      const data = await response.json();
      setTopGroup(data);
    } catch (error) {
      console.error("Error obteniendo el grupo con más inscritos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchTopGroup();

    // Intervalo cada 5 segundos para refrescar la data
    const interval = setInterval(() => {
      fetchTopGroup();
    }, 5000);

    // Limpiamos el intervalo cuando se desmonte el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-4 rounded-lg shadow-lg text-center"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <h2 className="text-xl font-bold" style={{ color: "#FF00FF" }}>
        Grupo con más inscritos
      </h2>
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

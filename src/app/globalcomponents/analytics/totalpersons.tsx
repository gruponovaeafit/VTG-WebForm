"use client";
import { useEffect, useState } from "react";

export default function TotalInscriptions() {
  const [total, setTotal] = useState<number | null>(null);

  // Función para obtener el total de inscritos
  const fetchTotal = async () => {
    try {
      const response = await fetch("/api/analytics/totalpersons");
      const data = await response.json();
      setTotal(data.total);
    } catch (error) {
      console.error("Error obteniendo total de inscritos:", error);
    }
  };

  useEffect(() => {
    // Llamada inicial
    fetchTotal();

    // Intervalo para repetir la llamada cada 5 segundos
    const interval = setInterval(() => {
      fetchTotal();
    }, 5000);

    // Limpiamos el intervalo cuando se desmonte el componente
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="p-4 rounded-lg shadow-lg text-center"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <h2 className="text-xl font-bold" style={{ color: "#FF00FF" }}>
        Total de Inscritos
      </h2>
      <p className="text-3xl font-extrabold" style={{ color: "#00FFFF" }}>
        {total !== null ? total : "Cargando..."}
      </p>
    </div>
  );
}

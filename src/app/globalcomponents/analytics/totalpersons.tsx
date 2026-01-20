"use client";
import { useEffect, useState } from "react";
import {Users} from "lucide-react";

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
  <div className="p-6 rounded-xl shadow-xl text-center border border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[200px] bg-[#000072]">   
    <div className="flex items-center justify-center mb-4">
      <Users className="h-6 w-6 mr-2" style={{ color: "#FE9A02" }} />
      <h2 className="text-xl font-ea" style={{ color: "#FFFFFF" }}>
        Total de Inscritos
      </h2>
    </div>

    <div className="flex-1 flex flex-col justify-center space-y-2">
      <div className="flex items-center justify-center">
        <p className="text-3xl font-ea tracking-tight" style={{ color: "#FFFFFF" }}>
          {typeof total === "number" ? total : (
            <span className="animate-pulse">---</span>
          )}
        </p>
      </div>

      {total !== null ? (
        <div></div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: "#00FFFF" }}></div>
          <p className="font-ea animate-pulse" style={{ color: "#FFFFFF" }}>
            Cargando datos...
          </p>
        </div>
      )}
    </div>
  </div>
  );
}
"use client";

import CareerChart from "@/app/globalcomponents/analytics/career";
import DaysChart from "@/app/globalcomponents/analytics/days";
import GroupsChart from "@/app/globalcomponents/analytics/groups";
import HoursChart from "@/app/globalcomponents/analytics/hours";
import SemesterChart from "@/app/globalcomponents/analytics/semester";
import TopGroup from "@/app/globalcomponents/analytics/top-group";
import TotalPersons from "@/app/globalcomponents/analytics/totalpersons";
import { useEffect } from "react";
import { BarChart2 } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.overflowY = "auto"; // Restaurar cuando se salga de la página
    };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-slate-900 flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-white/20 border border-white/40 shadow-md">
          <BarChart2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-ea text-white drop-shadow">
            Dashboard VTG
          </h1>
          <p className="text-sm text-orange-100">
            Resumen visual de inscripciones y participación
          </p>
        </div>
      </div>

      {/* Contenedores de estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[900px] mb-6">
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-orange-100">
          <TotalPersons />
        </div>
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-amber-100">
          <TopGroup />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-[1200px]">
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-orange-100">
          <CareerChart />
        </div>
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-amber-100">
          <SemesterChart />
        </div>
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-orange-100">
          <DaysChart />
        </div>
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-amber-100">
          <GroupsChart />
        </div>
        <div className="p-3 rounded-2xl shadow-lg bg-white/90 border border-orange-100">
          <HoursChart />
        </div>
      </div>
    </div>
  );
}

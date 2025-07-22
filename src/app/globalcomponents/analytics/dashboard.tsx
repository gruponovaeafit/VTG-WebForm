"use client";

import CareerChart from "@/app/globalcomponents/analytics/career";
import DaysChart from "@/app/globalcomponents/analytics/days";
import GroupsChart from "@/app/globalcomponents/analytics/groups";
import HoursChart from "@/app/globalcomponents/analytics/hours";
import SemesterChart from "@/app/globalcomponents/analytics/semester";
import TopGroup from "@/app/globalcomponents/analytics/top-group";
import TotalPersons from "@/app/globalcomponents/analytics/totalpersons";
import { useEffect } from "react";
import {BarChart2, BarChart3, BarChart4, BarChart} from "lucide-react"

export default function Dashboard() {
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.overflowY = "auto"; // Restaurar cuando se salga de la página
    };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-black text-white flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255, 0, 255, 0.1)", border: `1px solid ${"#FF00FF"}` }}>
            <BarChart2 className="h-5 w-5" style={{ color: "#FF00FF" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neon-pink">
              Dashboard VTG
            </h1>
          </div>
        </div>

    {/* Contenedores de estadísticas principales */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[800px] mb-4">
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-pink">
        <TotalPersons />
      </div>
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-blue">
        <TopGroup />
      </div>
    </div>

    {/* Gráficos */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-[1200px]">
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-green">
        <CareerChart />
      </div>
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-yellow">
        <SemesterChart />
      </div>
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-orange">
        <DaysChart />
      </div>
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-pink">
        <GroupsChart />
      </div>
      <div className="p-2 rounded-lg shadow-lg bg-gray-900 border border-neon-blue">
        <HoursChart />
      </div>
    </div>
  </div>
  );
}

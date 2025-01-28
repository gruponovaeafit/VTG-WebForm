"use client";

import { useState } from 'react';
import GroupInscriptionsChart from "@/app/globalcomponents/analytics/groups";

interface ChartData {
  date: string;
  value: number;
}

const Home: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);

  return (
    <div className="container mx-auto p-4">
      <GroupInscriptionsChart />
    </div>


  );
};

export default Home;

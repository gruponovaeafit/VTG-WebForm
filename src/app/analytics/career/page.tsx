"use client";

import { useState } from 'react';

import UsersByDegreeChart from "@/app/globalcomponents/analytics/career";



// Define el tipo de datos
interface ChartData {
  date: string;
  value: number;
}

const Home: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);


  return (
    <div className="container mx-auto p-4">
   1

      <UsersByDegreeChart />
    

    </div>


  );
};

export default Home;

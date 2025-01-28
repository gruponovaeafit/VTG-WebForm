import TotalInscriptions from "@/app/globalcomponents/analytics/totalpersons";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <TotalInscriptions />
    </div>
  );
}

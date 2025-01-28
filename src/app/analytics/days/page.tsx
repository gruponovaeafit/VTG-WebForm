import UsersByDate from "@/app/globalcomponents/analytics/days";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <UsersByDate />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "./FormContainer";

export default function Clubin1Form() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState<"Miercoles" | "Jueves" | "Viernes">("Miercoles");
  const [availableSlots, setAvailableSlots] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      console.log("📡 Iniciando solicitud para obtener horarios disponibles...");
      try {
        const res = await fetch("/api/forms/clubin");

        if (!res.ok) {
          throw new Error(`❌ Error al obtener los datos. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Datos de backend recibidos:", data);

        const grouped: { [key: string]: string[] } = {};

        data.data.forEach((slot: any) => {
          const day = slot.day_of_week;
          const time = slot.start_time;
          const cap = slot.capacity;
          console.log(`🕒 Slot recibido: ${day} - ${time} (capacidad: ${cap})`);

          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(time);
        });

        setAvailableSlots(grouped);
        console.log("📅 Slots agrupados y guardados en estado:", grouped);
      } catch (error) {
        console.error("🔥 Error al obtener los horarios disponibles:", error);
        toast.error("No se pudieron cargar los horarios. Inténtalo más tarde.");
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const payload = Object.fromEntries(formData.entries());
    console.log("🚀 Enviando datos del formulario:", payload);

    try {
      const response = await fetch("/api/forms/clubin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📥 Respuesta recibida del backend:", result);

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        const errorMessage = result.notification?.message || "Error en el servidor.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          onClose: () => {
            if (errorMessage === "Ya estás registrado en este grupo.") {
              console.log("🔁 Redireccionando a /groupslist por registro duplicado...");
              router.push("/groupslist");
            }
          },
        });

        return;
      }

      // Si todo sale bien
      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 500,
      });

      setTimeout(() => {
        console.log("🔁 Redireccionando a /gameover por inscripción exitosa...");
        router.push("/gameover");
      }, 2000);
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };


  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <button type="submit" className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300">Level Up!</button>
        ]}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm mb-4 text-blue-200">
            Debes inscribirte en uno de nuestros pre-assessment, elige el horario que mejor te quede
          </label>
          <label htmlFor="date" className="block text-sm mb-2 text-blue-200">
            Días
          </label>
          <select
            name="date"
            id="date"
            required
            value={selectedDay}
            onChange={(e) => {
              const newDay = e.target.value as "Miercoles" | "Jueves" | "Viernes";
              console.log("🗓️ Día seleccionado:", newDay);
              setSelectedDay(newDay);
            }}
            className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(availableSlots).map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="talk" className="block text-sm mb-2 text-blue-200">
            Horas
          </label>
          <select
            id="talk"
            name="talk"
            required
            className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableSlots[selectedDay]?.length > 0 ? (
              availableSlots[selectedDay].map((hora, index) => (
                <option key={index} value={hora}>
                  {hora}
                </option>
              ))
            ) : (
              <option disabled>No hay horarios disponibles</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="asesor" className="block text-sm mb-2 text-blue-200">
            Escribe el nombre de tu asesor
          </label>
          <input
            type="text"
            id="asesor"
            name="asesor"
            required
            className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

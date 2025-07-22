"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Clubin1Form() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState<"Miercoles" | "Jueves" | "Viernes">("Miercoles");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/clubin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.notification) {
          toast.error(result.notification.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Hubo un error inesperado. Inténtalo nuevamente.");
        }
        return;
      }

      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        router.push("/gameover");
      }, 2000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  const horarios = {
    Miercoles: [
      "1:00pm", "1:15pm", "1:30pm", "1:45pm",
      "2:00pm", "2:15pm", "2:30pm", "2:45pm",
      "3:30pm", "3:45pm", "4:00pm", "4:15pm",
      "4:30pm", "4:45pm", "5:00pm", "5:15pm",
      "5:30pm", "5:45pm",
    ],
    Jueves: [
      "8:30am", "8:45am", "9:00am", "9:15am",
      "9:30am", "9:45am", "10:15am", "10:30am",
      "10:45am", "11:00am", "11:15am", "11:30am",
      "11:45am", "3:15pm", "3:30pm", "3:45pm",
      "4:00pm", "4:15pm", "4:30pm", "4:45pm",
      "5:00pm", "5:15pm", "5:30pm", "5:45pm",
    ],
    Viernes: [
      "8:30am", "8:45am", "9:00am", "9:15am",
      "9:30am", "10:15am", "10:30am", "10:45am",
      "11:00am", "11:15am", "11:30am", "11:45am",
    ],
  };


  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm mb-4 text-blue-200">
            Debes inscribirte en uno de nuestros pre-assessment, elige el horario que mejor te quede
          </label>
          <label htmlFor="name" className="block text-sm mb-2 text-blue-200">
            Días
          </label>
          <select 
            name="date" 
            id="date"
            required
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as "Miercoles" | "Jueves" | "Viernes")}
            className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Miercoles", "Jueves", "Viernes"].map((date, index) => (
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
            {horarios[selectedDay]?.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
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

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

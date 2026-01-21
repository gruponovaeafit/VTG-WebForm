"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function Clubin1Form() {
  const router = useRouter();

  // ✅ Arranca sin día seleccionado (y NO se autoselecciona)
  const [selectedDay, setSelectedDay] = useState<"Miercoles" | "Jueves" | "Viernes" | "">("");
  const [availableSlots, setAvailableSlots] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const res = await fetch("/api/forms/clubin");
        if (!res.ok) throw new Error(`Error al obtener los datos. Status: ${res.status}`);

        const data = await res.json();
        if (!data || !Array.isArray(data.data)) {
          setAvailableSlots({});
          return;
        }

        const grouped: { [key: string]: string[] } = {};

        data.data.forEach((slot: any) => {
          const day = slot.day_of_week;
          const time = slot.start_time;
          const cap = slot.capacity;

          // ✅ Solo slots con cupo
          if (cap > 0) {
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(time);
          }
        });

        setAvailableSlots(grouped);
      } catch (error) {
        console.error("Error al obtener los horarios disponibles:", error);
        toast.error("No se pudieron cargar los horarios. Inténtalo más tarde.");
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validación simple: obliga a escoger día (y por ende hora)
    if (!selectedDay) {
      toast.error("Selecciona un día para ver los horarios.", { position: "top-center", autoClose: 1200 });
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/clubin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.notification?.message || "Error en el servidor.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1000,
          pauseOnHover: false,
          onClose: () => {
            if (errorMessage === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }

      toast.success(result.notification?.message || "Reserva realizada con éxito.", {
        position: "top-center",
        autoClose: 500,
      });

      setTimeout(() => router.push("/gameover"), 800);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario.");
    }
  };

  const hasSlots = !!(selectedDay && availableSlots[selectedDay]?.length > 0);

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <Button
            key="submit"
            type="submit"
            variant="verde"
            size="md"
            state="active"
            className="w-full h-14 md:px-15"
            theme="fifa"
          >
            SIGUIENTE
          </Button>,
        ]}
      >
        <div className="mb-4">
          <label className="block text-sm mb-4 text-blue-200">
            Debes inscribirte en uno de nuestros pre-assessment, elige el horario que mejor te quede
          </label>

          <Select
            id="date"
            name="date"
            label="Días"
            required
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as any)}
            options={[
              { label: "Selecciona un día", value: "" }, // ✅ placeholder
              ...Object.keys(availableSlots).map((date) => ({
                label: date,
                value: date,
              })),
            ]}
          />
        </div>

        <div className="mb-4">
          <Select
            id="talk"
            name="talk"
            label="Horas"
            required
            disabled={!hasSlots}
            options={
              hasSlots
                ? availableSlots[selectedDay].map((hora) => ({
                    label: hora,
                    value: hora,
                  }))
                : [{ label: "Selecciona un día primero", value: "" }]
            }
          />
        </div>
      </FormContainer>

      <ToastContainer />
    </>
  );
}

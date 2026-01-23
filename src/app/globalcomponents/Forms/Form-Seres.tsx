"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function SeresForm() {
  const router = useRouter();
  const [availableTalks, setAvailableTalks] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableTalks = async () => {
      console.log("📡 Iniciando solicitud para obtener charlas disponibles...");
      try {
        const res = await fetch("/api/forms/seres");

        if (!res.ok) {
          throw new Error(`❌ Error al obtener los datos. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Datos de backend recibidos:", data);

        // Verificar que data y data.data existan
        if (!data || !data.data) {
          console.warn("⚠️ No se recibieron datos válidos del servidor");
          setAvailableTalks([]);
          setIsLoading(false);
          return;
        }

        // Verificar que data.data sea un array
        if (!Array.isArray(data.data)) {
          console.warn("⚠️ data.data no es un array:", data.data);
          setAvailableTalks([]);
          setIsLoading(false);
          return;
        }

        const talks = data.data.map((talkSlot: any) => {
          // Formatear como "day_of_week, start_time" para mantener consistencia
          const talkLabel = `${talkSlot.day_of_week}, ${talkSlot.start_time}`;
          console.log(`🕒 Charla recibida: ${talkLabel} (capacidad: ${talkSlot.capacity})`);
          return {
            label: talkLabel,
            value: talkLabel,
          };
        });

        setAvailableTalks(talks);
        console.log("📅 Charlas disponibles:", talks);
        setIsLoading(false);
      } catch (error) {
        console.error("🔥 Error al obtener las charlas disponibles:", error);
        toast.error("No se pudieron cargar las charlas. Inténtalo más tarde.");
        setIsLoading(false);
      }
    };

    fetchAvailableTalks();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/seres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        const errorMessage = result.message || "Error en el servidor.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          onClose: () => {
            if (errorMessage === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /gameover
      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 1500,
        }
      );
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-0">
          <label htmlFor="talks" className="block text-sm mb-2 text-white font-bold">
            ¿A qué charla informativa deseas asistir?
          </label>
        
          <Select
            id="talk"
            name="talk"
            required
            disabled={isLoading || availableTalks.length === 0}
            className="w-full px-2 py-2 text-sm rounded border border-bl bg-yellow text-black focus:outline-none focus:ring-2 focus:ring-white"
            options={
              isLoading
                ? [{ label: "Cargando charlas...", value: "" }]
                : availableTalks.length > 0
                ? availableTalks
                : [{ label: "No hay charlas disponibles", value: "" }]
            }
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

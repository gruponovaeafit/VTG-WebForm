"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

// Tipos para la respuesta de la API
interface TalkSlot {
  day_of_week: string;
  start_time: string;
  capacity: number;
}

interface TalksApiResponse {
  data?: TalkSlot[];
  notification?: {
    type: string;
    message: string;
  };
}

export default function SeresForm() {
  const router = useRouter();
  const [availableTalks, setAvailableTalks] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailableTalks = async () => {
      try {
        const res = await fetch("/api/forms/seres");

        if (!res.ok) {
          throw new Error(`Error al obtener los datos. Status: ${res.status}`);
        }

        const data: TalksApiResponse = await res.json();

        // Verificar que data y data.data existan
        if (!data || !data.data) {
          setAvailableTalks([]);
          setIsLoading(false);
          return;
        }

        // Verificar que data.data sea un array
        if (!Array.isArray(data.data)) {
          setAvailableTalks([]);
          setIsLoading(false);
          return;
        }

        const talks = data.data.map((talkSlot) => {
          const talkLabel = `${talkSlot.day_of_week}, ${talkSlot.start_time}`;
          return {
            label: talkLabel,
            value: talkLabel,
          };
        });

        setAvailableTalks(talks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener las charlas disponibles:", error);
        toast.error("No se pudieron cargar las charlas. Inténtalo más tarde.");
        setIsLoading(false);
      }
    };

    fetchAvailableTalks();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/forms/seres",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

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

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /90+1
      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/90+1"),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state={isSubmitting ? "loading" : "active"} disabled={isSubmitting} className="w-full" theme="fifa">SIGUIENTE</Button>
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
  );
}

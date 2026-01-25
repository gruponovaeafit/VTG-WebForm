"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function SpieForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    
    // Validar el formulario antes de enviar
    if (!form.checkValidity()) {
      // Mostrar mensajes de validación del navegador
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await encryptedFetch(
        "/api/forms/spie",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 1000,
          onClose: () => {
            if (result.message === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }

      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/90+1"),
      });
    } catch {
      toast.error("Error al enviar el formulario.", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="relative flex items-start justify-center w-full">
        <Image
          src="/forma-spie1.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 z-0 pointer-events-none select-none opacity-50"
        />

        <Image
          src="/forma-spie2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 z-0 pointer-events-none select-none opacity-50"
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <FormContainer
            onSubmit={handleFormSubmit}
            buttons={[
              <Button key="submit" type="submit" variant="verde" size="md" state={isSubmitting ? "loading" : "active"} disabled={isSubmitting} className="w-full" theme="fifa">SIGUIENTE</Button>
            ]}
          >
            <Select
              id="comite"
              name="comite"
              label="¿A qué comité te gustaría ingresar?"
              required
              labelColorClass="text-white"
              options={[
                { label: "Comité de Publicidad", value: "Comité de Publicidad" },
                { label: "Comité de Divulgación", value: "Comité de Divulgación" },
                { label: "Comité de RRPP", value: "Comité de RRPP" },
                { label: "Comité de GH", value: "Comité de GH" },
              ]}
            />

            <Select
              id="talk"
              name="talk"
              label="¿A qué charla te gustaría asistir?"
              required
              labelColorClass="text-white"
              options={[
                { label: "Vie. 30 Ene, 12:00 p.m.", value: "Vie. 30 Ene, 12:00 p.m." },
                { label: "Vie. 30 Ene, 2:00 p.m.", value: "Vie. 30 Ene, 2:00 p.m." },
                { label: "Vie. 6 Feb, 12:00 p.m.", value: "Vie. 6 Feb, 12:00 p.m." },
              ]}
            />

            <Input
              type="text"
              name="referral_name"
              label="Nombre del que te dio la información"
              placeholder="Nombre"
              containerClassName="mb-4"
            />
          </FormContainer>
        </div>
      </div>
  );
}

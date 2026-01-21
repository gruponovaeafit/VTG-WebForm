"use client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Input from "../UI/Input";
import Button from "../UI/Button";

export default function UnForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/un", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

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
        <div className="mb-2">
          
          <Select
            id="committie"
            name="committie"
            label="¿A qué comité te gustaría ingresar?"
            labelColorClass="text-white"
            required
            options={[
              { label: "Académico", value: "Académico"  },
              { label: "Logística", value: "Logística" },
              { label: "GH", value: "GH" },
              { label: "RP y Redes", value: "RP y Redes" },
            ]}
          />
        </div>

        <div className="mb-2">
          
          <Select
            id="talk"
            name="talk"
            label="¿A qué charla te gustaría asistir?"
            labelColorClass="text-white"
            required
            options={[
              { label: "Viernes 30 de enero 2:00 p.m. – 3:30 p.m.", value: "Viernes 30 de enero 2:00 p.m. – 3:30 p.m." },
              { label: "Viernes 30 de enero 4:00 p.m. – 5:30 p.m.", value: "Viernes 30 de enero 4:00 p.m. – 5:30 p.m." },
            ]}
          />
        </div>

        <div className="mb-2">
          <Input
              type="text"
              name="referral_name"
              label="¿Quién te inscribió?"
              placeholder="Nombre"
              required
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

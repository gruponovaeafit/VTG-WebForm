"use client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
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
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-2">
          <label htmlFor="committies" className="block text-sm mb-2 text-blue-400">
            ¿Cuáles son tus comités de preferencia?
          </label>
          
          <Select
            id="committie"
            name="committie"
            required
            className="w-full px-2 py-2 text-xs rounded border border-blue-400 bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            options={[
              { label: "Publicidad y Redes", value: "Publicidad y Redes" },
              { label: "Gestión Humana", value: "Gestión Humana" },
              { label: "Relaciones Públicas", value: "Relaciones Públicas" },
              { label: "Logística", value: "Logística" },
              { label: "Académico", value: "Académico" },
            ]}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="talks" className="block text-sm mb-2 text-blue-400">
            ¿Podrás asistir a la charla informativa del Viernes 25 de julio a las 4:00pm?
          </label>
          
          <Select
            id="talk"
            name="talk"
            required
            className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            options={[
              { label: "Sí, podré asistir", value: "Sí, podré asistir" },
              { label: "No, nos vemos en el Assessment.", value: "No, nos vemos en el Assessment." },
            ]}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="assessment" className="block text-sm mb-2 text-blue-400">
            ¿Puedes asistir al assessment el sábado 26 de julio?
          </label>
          
          <Select
            id="assessment"
            name="assessment"
            required
            className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            options={[
              { label: "Sí", value: "Sí" },
              { label: "No", value: "No" },
            ]}
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

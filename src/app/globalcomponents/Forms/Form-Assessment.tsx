"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function AssessmentForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Recolectar los datos del formulario
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Enviar la petición al endpoint /api/Data-AssessmentInfo (SIN captcha)
      const response = await fetch("/api/Data-AssessmentInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...Object.fromEntries(formData.entries()),
        }),
      });

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        if (result.notification) {
          toast.error(result.notification.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Ocurrió un error al enviar el formulario.", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        return;
      }

      // Si todo fue exitoso
      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Redirigir después de que se cierre la notificación
          if (result.redirectUrl) {
            router.push(result.redirectUrl);
          } else {
            // Por si no llega redirectUrl, ir a home o la ruta que prefieras
            router.push("/home");
          }
        },
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error interno al enviar el formulario.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleFormSubmit} 
      overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full" 
      formClassName="space-y-4" 
      buttons={[
        <Button type="submit" color="rojo" size="md" state="active" className="w-full">Level Up!</Button>
      ]}>
        {/* Campo 1: Restricciones o preferencias alimentarias */}
        <div className="mb-4">
          <Input
            type="text"
            id="foodRestrictions"
            name="foodRestrictions"
            required
            placeholder="Cuéntanos acá"
            borderColorClass="border-purple-600"
            focusRingColorClass="focus:ring-purple-700"
            labelColorClass="text-purple-600"
            label="¿Cuentas con alguna preferencia o restricción en tu alimentación?"
          />
        </div>

        {/* Campo 2: Consideraciones de salud o movilidad */}
        <div className="mb-4">
          <Input
            type="text"
            id="healthConsiderations"
            name="healthConsiderations"
            required
            placeholder="Cuéntanos acá"
            borderColorClass="border-purple-600"
            focusRingColorClass="focus:ring-purple-700"
            labelColorClass="text-purple-600"
            label="¿Existe alguna consideración de salud o movilidad que te gustaría compartir para garantizar tu comodidad y seguridad durante las actividades?"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

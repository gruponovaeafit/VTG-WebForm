"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Button from "../UI/Button";

export default function TalkEmailForm() {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captcha) {
      toast.error("Por favor completa el reCAPTCHA antes de enviar.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/Data-EmailTalk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: captcha,
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
        if (captchaRef.current) captchaRef.current.reset();
        setCaptcha(null);
        return;
      }

      // Si todo está bien desde el servidor, muestra un toast de éxito 
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
          }
        },
      });

      // Resetear captcha
      if (captchaRef.current) captchaRef.current.reset();
      setCaptcha(null);
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
      if (captchaRef.current) captchaRef.current.reset();
      setCaptcha(null);
    }
  };

  return (
    <>
      <FormContainer 
      onSubmit={handleFormSubmit} 
      overlayClassName="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full" 
      formClassName="space-y-4" 
      buttons={[
        <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
      ]}>
        <div className="mb-4">
          <Input
            type="email"
            name="email"
            label="Correo Institucional"
            placeholder="usuario@eafit.edu.co"
            required
            borderColorClass="border-purple-400"
            focusRingColorClass="focus:ring-purple-500"
            labelColorClass="text-purple-400"
          />
        </div>

        <div className="flex justify-center mb-4 w-full overflow-visible">
          <div className="transform scale-90 sm:scale-100 origin-center" style={{ touchAction: 'manipulation' }}>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_CLIENT_KEY_CAPTCHA!}
              onChange={(token) => setCaptcha(token)}
            />
          </div>
        </div>

      </FormContainer>
      <ToastContainer />
    </>
  );
}

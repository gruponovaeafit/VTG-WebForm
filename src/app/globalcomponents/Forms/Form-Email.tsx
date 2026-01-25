"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

// Lazy load ReCAPTCHA para mejorar LCP
const ReCAPTCHA = dynamic(
  () => import("react-google-recaptcha"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[78px] w-[304px] bg-gray-200 animate-pulse rounded flex items-center justify-center">
        <span className="text-gray-500 text-sm">Cargando verificación...</span>
      </div>
    )
  }
);

export default function EmailForm() {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0); // Key para forzar reset del captcha

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captcha) {
      toast.error("Por favor completa el reCAPTCHA antes de enviar.", {
        position: "top-center",
        autoClose: 2500, // Notificación de 2.5 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/Data-Email",
        {
          token: captcha,
          ...Object.fromEntries(formData.entries()),
        }
      );

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        if (result.notification) {
          toast.error(result.notification.message, {
            position: "top-center",
            autoClose: 500, // Notificación de 0.8 segundos
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Ocurrió un error al enviar el formulario.", {
            position: "top-center",
            autoClose: 2500, // Notificación de 1.5 segundos
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        setCaptchaKey(k => k + 1); // Reset captcha
        setCaptcha(null);
        return;
      }

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /home
      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 500, // Notificación de 1.5 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Redirigir después de que se cierre la notificación
          if (result.success) {
            router.push("/home");
          } else if (result.redirectUrl) {
            router.push(result.redirectUrl);
          }
        },
      });

      setCaptchaKey(k => k + 1); // Reset captcha
      setCaptcha(null);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error interno al enviar el formulario.", {
        position: "top-center",
        autoClose: 2500, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCaptchaKey(k => k + 1); // Reset captcha
      setCaptcha(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <FormContainer 
      onSubmit={handleFormSubmit} 
    
      buttons={[
        <Button key="submit" type="submit" variant="verde" size="md" state={isSubmitting ? "loading" : "active"} disabled={isSubmitting} className="w-full" theme="fifa">SIGUIENTE</Button>
      ]}>
        <Input
          type="email"
          name="email"
          label="Correo Institucional"
          placeholder="usuarix@eafit.edu.co"
          required
          borderColorClass="border-black"
          focusRingColorClass="focus:ring-white"
          labelColorClass="text-white"
        />

        <div className="flex justify-center mb-4 w-full overflow-visible">
          <div className="transform scale-90 sm:scale-100 origin-center" style={{ touchAction: 'manipulation' }}>
            <ReCAPTCHA
              key={captchaKey}
              sitekey={process.env.NEXT_PUBLIC_CLIENT_KEY_CAPTCHA!}
              onChange={(token: string | null) => setCaptcha(token)}
            />
          </div>
        </div>
      </FormContainer>
  );
}

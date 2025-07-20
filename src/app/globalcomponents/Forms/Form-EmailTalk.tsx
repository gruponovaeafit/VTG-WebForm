"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

export default function TalkEmailForm() {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captcha) {
      toast.error("Por favor completa el reCAPTCHA antes de enviar.", {
        position: "top-center",
        autoClose: 2000,
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
        autoClose: 1500, 
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
        autoClose: 2000,
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
    <div className="relative">
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-2 text-purple-400">
            Correo Institucional
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="usuario@eafit.edu.co"
            className="w-full px-4 py-2 rounded border border-purple-400 bg-black text-white text-sm placeholder:text-xs
                       focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:opacity-70"
          />
        </div>

        <div className="flex justify-center mb-4">
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_CLIENT_KEY_CAPTCHA!}
            onChange={(token) => setCaptcha(token)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600
                     font-bold uppercase tracking-wider transition duration-300 mt-4"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

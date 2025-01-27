"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function EmailForm() {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ type: string; message: string }[]>([]);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const addNotification = (type: string, message: string) => {
    setNotifications((prev) => [...prev, { type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captcha) {
      addNotification("error", "Por favor completa el reCAPTCHA antes de enviar.");
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/Data-Email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: captcha,
          ...Object.fromEntries(formData.entries()), // => {email: "...", etc.}
        }),
      });

      const result = await response.json();

      // Verificamos si la petición fue 2xx
      if (!response.ok) {
        addNotification("error", result.message || "Ocurrió un error al enviar el formulario.");
        // Resetea el reCAPTCHA si falla
        if (captchaRef.current) captchaRef.current.reset();
        setCaptcha(null);
        return;
      }

      // response.ok = true => revisamos si success = true o false
      if (result.success) {
        // Si se insertó el usuario
        addNotification("success", result.message || "¡Registro exitoso!");
        // La cookie ya fue seteada en la respuesta
        // Redirigir a "/home" (por ejemplo) tras un breve delay
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        // El usuario ya existía
        addNotification("error", result.message || "El usuario ya está registrado.");

        // En este caso la cookie también se envió
        // Redirigir a result.redirectUrl si existe
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }

        // Resetea el reCAPTCHA
        if (captchaRef.current) captchaRef.current.reset();
        setCaptcha(null);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      addNotification("error", "Error interno al enviar el formulario.");
      if (captchaRef.current) captchaRef.current.reset();
      setCaptcha(null);
    }
  };

  return (
    <div className="relative">
      {/* Notificaciones */}
      <div className="absolute top-0 right-0 m-4 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md text-sm ${
              notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        {/* Correo */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-2 text-green-400">
            Correo Institucional
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="usuario@eafit.edu.co"
            className="w-full px-4 py-2 rounded border border-green-400 bg-black text-white text-sm placeholder:text-xs
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:opacity-70"
          />
        </div>

        {/* reCAPTCHA */}
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
          ¡Enviar!
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function PersonalForm() {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);

  const handleInvalidEmail = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity("Por favor ingresa un correo válido con el dominio @eafit.edu.co.");
  };

  const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captcha) {
      alert("Por favor completa el reCAPTCHA antes de enviar.");
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: captcha, // Token de reCAPTCHA
          ...Object.fromEntries(formData.entries()), // Datos del formulario
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta del servidor:", errorData);
        alert(`Error: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert("Formulario enviado correctamente.");
        router.push("/academic"); // Redirige a la siguiente página
      } else {
        alert(`Error en la validación: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error interno al enviar el formulario.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm mb-2 text-pink-400">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Pepito"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="secondName" className="block text-sm mb-2 text-pink-400">
          Apellidos
        </label>
        <input
          type="text"
          id="secondName"
          name="secondName"
          required
          placeholder="Perez"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm mb-2 text-green-400">
          Correo Institucional
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="pp@eafit.edu.co"
          pattern="^[a-zA-Z0-9._%+-]+@eafit\\.edu\\.co$"
          title="El correo debe ser institucional (@eafit.edu.co)."
          onInvalid={handleInvalidEmail}
          onInput={handleInputEmail}
          className="w-full px-4 py-2 rounded border border-green-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:opacity-70"
        />
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_CLIENT_KEY_CAPTCHA!}
          onChange={(token) => setCaptcha(token)}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300 mt-4"
      >
        ¡Enviar!
      </button>
    </form>
  );
}

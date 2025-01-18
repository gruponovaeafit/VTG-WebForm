"use client";
import { useEffect } from "react";

export default function PersonalForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar si grecaptcha está disponible
    if (typeof grecaptcha === "undefined") {
      console.error("reCAPTCHA no está disponible.");
      return;
    }

    // Ejecutar reCAPTCHA
    grecaptcha.ready(() => {
      grecaptcha.execute(process.env.CLIENT_KEY_CAPTCHA, { action: "submit" }).then(async (token: string) => {
        console.log("reCAPTCHA token:", token);

        // Envía el token y los datos del formulario al servidor
        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            formData: Object.fromEntries(formData.entries()), // Convierte FormData a un objeto
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log("Formulario enviado correctamente.");
        } else {
          console.error("Error al enviar el formulario.");
        }
      });
    });
  };

  const handleInvalidEmail = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity("Por favor ingresa un correo válido con el dominio @eafit.edu.co.");
  };

  const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity("");
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
          title="Ingresa tu Nombre"
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
          title="Ingresa tus Apellidos"
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
          onInvalid={handleInvalidEmail}
          onInput={handleInputEmail}
          title="El correo debe ser institucional (@eafit.edu.co)."
          className="w-full px-4 py-2 rounded border border-green-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:opacity-70"
        />
      </div>

      <div
        className="g-recaptcha"
        data-sitekey={process.env.CLIENT_KEY_CAPTCHA}
      ></div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        ¡Enviar!
      </button>
    </form>
  );
}

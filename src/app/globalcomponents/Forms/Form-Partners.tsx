"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PartnersForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message) {
          toast.error(result.message, {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error("Error en el servidor.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        return;
      }

      toast.success("Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"

      >
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm mb-2 text-orange-400">
          ¿Quién te registró?
        </label>
        <input
          type="text"
          id="who"
          name="who"
          required
          placeholder="Nombre"
          title="Ingresa el nombre de quien te registró"
          className="w-full px-4 py-2 text-sm rounded border border-orange-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:opacity-85"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="Pregunta 1" className="block text-sm mb-2 text-orange-400 px-4">
          ¿Vas a asistir a alguna de nuestras charlas informativas?
        </label>
        <select
          name="talkSelection"
          id="talkSelection"
          required
          className="w-full px-4 py-2 text-xs rounded border border-orange-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-400" style={{ fontSize: '0.875rem' }}
        >
          {[
            "Mar. 28 ene, 5 p.m.",
            "Mie. 29 ene, 5 p.m.",
            "Jue. 30 ene, 5 p.m.",
            "Vie. 31 ene, 9 a.m."           
          ].map((talk, index) => (
            <option key={index} value={talk}>
              {talk}
            </option>
          ))}
        </select>
      </div>


      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm mb-2 text-orange-400">
            ¿Quién te registró?
          </label>
          <input
            type="text"
            id="who"
            name="who"
            required
            placeholder="Nombre"
            title="Ingresa el nombre de quien te registró"
            className="w-full px-4 py-2 text-sm rounded border border-orange-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:opacity-85"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="Pregunta 1"
            className="block text-sm mb-2 text-orange-400 px-4"
          >
            ¿Vas a asistir a alguna de nuestras charlas informativas?
          </label>
          <select
            name="talkSelection"
            id="talkSelection"
            required
            className="w-full px-4 py-2 text-xs rounded border border-orange-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            style={{ fontSize: "0.875rem" }}
          >
            {[
              "Sáb. 27 ene, 5 p.m.",
              "Dom. 28 ene, 5 p.m.",
              "Lun. 29 ene, 5 p.m.",
              "Mar. 30 ene, 9 a.m.",
            ].map((talk, index) => (
              <option key={index} value={talk}>
                {talk}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

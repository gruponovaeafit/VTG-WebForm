"use client";

import { useRouter } from "next/navigation";

export default function InfoSPIE() {
  const router = useRouter();

  const handleNextClick = () => {
    router.push("/groups/spie/form/"); // Asegúrate de que esta sea la ruta correcta para tu formulario de SPIE
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="mb-4 text-red-600">Comités</h1>
      <p className="text-[10px] mb-2">
        <span className="font-bold text-red-600">Comité de publicidad:</span> Crea, gestiona y planifica la publicidad (física y digital) del capítulo SPIE.
      </p>
      <p className="text-[10px] mb-2">
        <span className="font-bold text-red-600">Comité de divulgación:</span> Planea y ejecuta actividades de divulgación científica y experimentos creativos en la universidad y otros espacios.
      </p>
      <p className="text-[10px] mb-2">
        <span className="font-bold text-red-600">Comité de RRPP:</span> Gestiona la imagen del grupo y establece vínculos con la comunidad y diferentes patrocinadores para mayor visibilidad.
      </p>
      <p className="text-[10px] mb-2">
        <span className="font-bold text-red-600">Comité de GH:</span> Genera un ambiente seguro y acogedor para los miembros mediante diversas actividades de integración.
      </p>

      <button
        type="button"
        onClick={handleNextClick} // Función para manejar el clic
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        Siguiente
      </button>
    </div>
  );
}

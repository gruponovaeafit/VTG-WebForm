"use client";

import { useRouter } from "next/navigation";

export default function InfoUn2() {

    const router = useRouter();

    const handleNextClick = () => {
      router.push("/groups/unsociety/form/"); // Asegúrate de que esta sea la ruta correcta para tu formulario de SPIE
    };

    return (
        <div className="bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="mb-4 text-blue-400">Comités</h1>
      <p className="text-[10px] mb-1">
        <span className="font-bold text-blue-400">Publicidad y redes:</span> Responsables de la creación de contenido para redes sociales y del diseño de material gráfico.
      </p>
      <p className="text-[10px] mb-1">
        <span className="font-bold text-blue-400">Gestión Humana:</span> Gestores de las dinamicas sociales y el bienestar del grupo, enfocados en la construcción de un ambiente activo y sano.
      </p>
      <p className="text-[10px] mb-1">
        <span className="font-bold text-blue-400">Relaciones Públicas:</span> Encargados del desarrollo de fuertes vinculos de patrocinios, convenios y beneficios con aliados estrategicos.
      </p>
      <p className="text-[10px] mb-1">
        <span className="font-bold text-blue-400">Logística y Mercadeo:</span> Estrategia, contacto y coordinación para alcanzar metas. 
      </p>
      <p className="text-[10px] mb-1">
        <span className="font-bold text-blue-400">Académico:</span> Formadores de lideres, encargados de contacto de ponentes y montaje de eventos académicos.
      </p>
    
        <button
            type="button"
            onClick={handleNextClick} // Función para manejar el clic
            className="w-full mt-3 py-2 px-3 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-400 font-bold uppercase tracking-wider transition duration-300"
        >
            Siguiente
        </button>
        
        </div>

    );
}

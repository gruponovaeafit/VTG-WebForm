"use client";
import FormContainer from "../UI/FormContainer";

export default function InfoSeres() {
    return (
        <>
        <FormContainer
            overlayClassName="w-full max-w-7xl rounded-tl-[52px] rounded-tr-[52px] rounded-bl-[52px] rounded-br-0 border-[10px] border-black bg-black/65 p-0"
            formClassName="flex flex-col"
        >
        <div className="bg-gray-800 bg-opacity-90 p-3 sm:p-4 w-full h-full rounded-tl-[42px] rounded-tr-[42px] rounded-bl-[42px] rounded-br-0">
            <h1 className="mb-1 text-xs sm:text-sm text-blue-200 font-semibold">Grupo Seres</h1>
            <p className="mb-1 text-[10px] sm:text-xs leading-tight">Seres es familia, es el grupo encargado de la labor social y voluntariado de la universidad. Asistimos a fundaciones que nos llenan el corazón y siempre nos dan más de lo que recibimos. Contamos con un macro evento llamado "Se vale ser" que tiene un trasfondo muy bonito en la que apoyamos a una de nuestras fundaciones e impactamos a toda la universidad. </p>
            <h1 className="mb-0 text-xs sm:text-sm text-blue-200 font-semibold">¡Te esperamos!</h1>
        </div>
        </FormContainer>
        </>
    );
}

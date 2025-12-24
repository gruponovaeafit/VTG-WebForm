"use client";
import FormContainer from "../Forms/FormContainer";

export default function InfoTvu() {
    return (
        <>
        <FormContainer>
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="mb-2 text-purple-400">TVU</h1>
            <p className="mb-2 text-[10px]">El grupo de producciones audiovisuales de la universidad Eafit. Un grupo donde puedes explotar tu creatividad y aprender cosas nuevas. </p>
            <h1 className="mb-2 text-purple-400">Departamentos </h1>
            <p className="text-[10px] text-white">(Producción, Mercadeo, Edición, Gestión Humana y Relaciones Públicas)</p>    
        </div>
        </FormContainer>
        </>
    );
}

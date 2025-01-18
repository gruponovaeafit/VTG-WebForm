"use client";

export default function PersonalForm() {

    const handleInvalidEmail = (e: React.InvalidEvent<HTMLInputElement>) => {
        e.target.setCustomValidity("Por favor ingresa un correo válido con el dominio @eafit.edu.co.");
    };

    const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.setCustomValidity("");
    };

    return (
      <form
      action="/academic"
      method="POST"
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
          placeholder="Nombre"
          title="Ingresa tu Nombre"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-sm placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          placeholder="Apellidos"
          title="Ingresa tus Apellidos"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-sm placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          placeholder="Correo"
          pattern="^[a-zA-Z0-9._%+-]+@eafit\.edu\.co$"
          onInvalid={handleInvalidEmail}
          onInput={handleInputEmail}
          title="El correo debe ser institucional (@eafit.edu.co)."
          className="w-full px-4 py-2 rounded border border-green-400 bg-black text-white text-sm placeholder:text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    
      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        ¡Enviar!
      </button>

      <label> INCLUIR CAPTCHA</label>

    </form>
    
    
    );
}

"use client";

export default function AlreadyUserForm() {


    return (
      <form
        action="/api/forms"
        method="POST"
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >  

        <div className="mb-4">
          <label htmlFor="studentGroup" className="block text-m mb-2 text-teal-400">
            Grupo estudiantil de interés
          </label>
          <select
            id="studentGroup"
            name="studentGroup"
            required
            className="w-full px-4 py-2 rounded border border-teal-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {[
              "AIESEC",
              "CLUBIN",
              "CLUBMERC",
              "GPG",
              "NEXOS",
              "NOVA",
              "PARTNERS",
              "SERES",
              "SPIE",
              "TUTORES",
              "TVU",
              "UN SOCIETY",
            ].map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
        </div>
  
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
        >
          ¡Enviar!
        </button>
      </form>
    );
}

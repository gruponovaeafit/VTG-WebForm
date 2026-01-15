"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../globalcomponents/UI/FormContainer";
import Input from "../globalcomponents/UI/Input";

interface Persona {
  correo: string;
  nombre: string;
  pregrado: string;
  pregrado_2: string | null;
  semestre: number | null;
  fecha_creacion: string;
}

interface GrupoOption {
  key: string;
  id: number;
  label: string;
}

export default function TestPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    pregrado: "",
    pregrado_2: "",
    semestre: "",
    grupo: "",
  });

  // Permitir scroll en esta página
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  const grupos: GrupoOption[] = [
    { key: "aiesec", id: 1, label: "AIESEC" },
    { key: "club_in", id: 2, label: "Club In" },
    { key: "club_merc", id: 3, label: "Club Mercadeo" },
    { key: "gpg", id: 4, label: "GPG" },
    { key: "nexos", id: 5, label: "Nexos" },
    { key: "nova", id: 6, label: "NOVA" },
    { key: "oe", id: 7, label: "OE" },
    { key: "partners", id: 8, label: "Partners" },
    { key: "seres", id: 9, label: "Seres" },
    { key: "spie", id: 10, label: "SPIE" },
    { key: "tutores", id: 11, label: "Tutores" },
    { key: "tvu", id: 12, label: "TVU" },
    { key: "un", id: 13, label: "UN Society" },
  ];

  // Cargar personas al montar el componente
  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/test/persona");
      const result = await response.json();

      if (result.success) {
        setPersonas(result.data);
      } else {
        toast.error("Error al cargar las personas");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar las personas");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/api/test/persona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: formData.correo,
          nombre: formData.nombre,
          pregrado: formData.pregrado,
          pregrado_2: formData.pregrado_2 || null,
          semestre: formData.semestre ? parseInt(formData.semestre) : null,
          ...(formData.grupo ? { grupo: formData.grupo } : {}),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Datos guardados exitosamente");
        setFormData({
          correo: "",
          nombre: "",
          pregrado: "",
          pregrado_2: "",
          semestre: "",
          grupo: "",
        });
        loadPersonas();
      } else {
        toast.error(result.message || "Error al guardar los datos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (correo: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${correo}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/test/persona", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Persona eliminada exitosamente");
        loadPersonas();
      } else {
        toast.error(result.message || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Página de Prueba - Ingreso de Datos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div>
            <FormContainer
              title="Ingresar/Actualizar Persona"
              onSubmit={handleFormSubmit}
              overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg"
              formClassName="space-y-4"
              buttons={[
                <button
                  key="submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-blue-500 text-white rounded shadow hover:bg-blue-600 active:bg-blue-700 font-bold uppercase tracking-wider transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>,
                <button
                  key="reload"
                  type="button"
                  onClick={loadPersonas}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-green-500 text-white rounded shadow hover:bg-green-600 active:bg-green-700 font-bold uppercase tracking-wider transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Recargar Lista
                </button>,
              ]}
            >
              <Input
                type="email"
                name="correo"
                label="Correo"
                placeholder="ejemplo@eafit.edu.co"
                required
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                colorTheme="blue"
              />

              <Input
                type="text"
                name="nombre"
                label="Nombre Completo"
                placeholder="Juan Pérez"
                required
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                colorTheme="blue"
              />

              <Input
                type="text"
                name="pregrado"
                label="Pregrado"
                placeholder="Ingeniería de Sistemas"
                required
                value={formData.pregrado}
                onChange={(e) =>
                  setFormData({ ...formData, pregrado: e.target.value })
                }
                colorTheme="blue"
              />

              <Input
                type="text"
                name="pregrado_2"
                label="Segundo Pregrado (Opcional)"
                placeholder="No aplica"
                value={formData.pregrado_2}
                onChange={(e) =>
                  setFormData({ ...formData, pregrado_2: e.target.value })
                }
                colorTheme="blue"
              />

              <Input
                type="number"
                name="semestre"
                label="Semestre"
                placeholder="5"
                min="1"
                max="20"
                value={formData.semestre}
                onChange={(e) =>
                  setFormData({ ...formData, semestre: e.target.value })
                }
                colorTheme="blue"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grupo (opcional)
                </label>
                <select
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.grupo}
                  onChange={(e) =>
                    setFormData({ ...formData, grupo: e.target.value })
                  }
                >
                  <option value="">-- No asignar grupo --</option>
                  {grupos.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label} (id_grupo {g.id})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Para pruebas: asigna también el id_grupo correspondiente.
                </p>
              </div>
            </FormContainer>
          </div>

          {/* Lista de Personas */}
          <div>
            <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Personas Registradas ({personas.length})
              </h2>

              {loading && personas.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Cargando...
                </div>
              ) : personas.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No hay personas registradas
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                      <tr>
                        <th className="px-4 py-3">Correo</th>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Pregrado</th>
                        <th className="px-4 py-3">Semestre</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map((persona) => (
                        <tr
                          key={persona.correo}
                          className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-4 py-3">{persona.correo}</td>
                          <td className="px-4 py-3">{persona.nombre}</td>
                          <td className="px-4 py-3">
                            {persona.pregrado}
                            {persona.pregrado_2 && (
                              <span className="text-gray-400 text-xs block">
                                + {persona.pregrado_2}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {persona.semestre || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(persona.correo)}
                              disabled={loading}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}


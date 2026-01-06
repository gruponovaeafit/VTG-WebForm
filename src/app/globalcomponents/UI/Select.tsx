"use client";

//Componente reutilizable de Select con soporte para errores y textos de ayuda
import React from "react";


// Definición de tipos para las opciones y las props del componente Select
type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  name: string;
  label?: string;
  options: Option[];
  defaultValue?: string;
  error?: string;        
  helperText?: string;   
};

//Componente Select
export default function Select({
  id,
  name,
  label,
  options,
  defaultValue,
  disabled,
  error,
  helperText,
  className = "",
  ...rest
}: SelectProps) {
    //Clases base y condicionales para el estilo del select
  const baseClasses =
    "w-full px-4 py-2 rounded border bg-black text-white text-sm focus:outline-none";
  const normalBorder = "border-purple-600 focus:ring-2 focus:ring-purple-700";
  const errorBorder = "border-red-500 focus:ring-2 focus:ring-red-500";

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm mb-2 text-purple-600">
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`${baseClasses} ${error ? errorBorder : normalBorder} ${className}`}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-purple-300">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
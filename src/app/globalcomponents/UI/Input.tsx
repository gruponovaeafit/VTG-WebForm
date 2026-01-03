"use client";

import React from "react";

type InputType = 
  | "text"
  | "email"
  | "tel"
  | "number"
  | "password"
  | "date"
  | "time"
  | "datetime-local"
  | "url"
  | "search"
  | "color"
  | "file"
  | "range"
  | "hidden"
  | "month"
  | "week";

type ColorTheme = 
  | "blue"
  | "pink"
  | "purple"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "cyan"
  | "orange"
  | "teal";

type InputProps = {
  type?: InputType;
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  title?: string;
  autoComplete?: string;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  colorTheme?: ColorTheme; 
  borderColorClass?: string; 
  focusRingColorClass?: string; 
  labelColorClass?: string;
  // Estados y mensajes
  error?: boolean; // Indica si el input tiene un error
  errorMessage?: string; // Mensaje de error a mostrar
  helpText?: string; // Texto de ayuda o información adicional
};

// Mapeo de temas de color a clases de Tailwind
const colorThemes: Record<ColorTheme, { border: string; focusRing: string; label: string }> = {
  blue: { border: "border-blue-400", focusRing: "focus:ring-blue-500", label: "text-blue-400" },
  pink: { border: "border-pink-400", focusRing: "focus:ring-pink-500", label: "text-pink-400" },
  purple: { border: "border-purple-600", focusRing: "focus:ring-purple-700", label: "text-purple-600" },
  green: { border: "border-green-400", focusRing: "focus:ring-green-500", label: "text-green-400" },
  yellow: { border: "border-yellow-400", focusRing: "focus:ring-yellow-500", label: "text-yellow-400" },
  red: { border: "border-red-400", focusRing: "focus:ring-red-500", label: "text-red-400" },
  indigo: { border: "border-indigo-400", focusRing: "focus:ring-indigo-500", label: "text-indigo-400" },
  cyan: { border: "border-cyan-400", focusRing: "focus:ring-cyan-500", label: "text-cyan-400" },
  orange: { border: "border-orange-400", focusRing: "focus:ring-orange-500", label: "text-orange-400" },
  teal: { border: "border-teal-400", focusRing: "focus:ring-teal-500", label: "text-teal-400" },
};

export default function Input({
  type = "text",
  id,
  name,
  label,
  placeholder,
  required = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  min,
  max,
  step,
  pattern,
  title,
  autoComplete,
  className = "",
  labelClassName = "",
  containerClassName = "",
  colorTheme = "blue",
  borderColorClass,
  focusRingColorClass,
  labelColorClass,
  error = false,
  errorMessage,
  helpText,
}: InputProps) {
  // Determinar las clases de color
  const theme = colorThemes[colorTheme];
  
  // Si hay error, usar colores de error, sino usar los colores del tema
  const borderClass = error 
    ? "border-red-500" 
    : (borderColorClass || theme.border);
  const focusRingClass = error
    ? "focus:ring-red-500"
    : (focusRingColorClass || theme.focusRing);
  const labelColor = error
    ? "text-red-400"
    : (labelColorClass || theme.label);

  // Clases base del input
  const baseInputClasses = `w-full px-4 py-2 text-sm rounded border bg-black text-white placeholder:text-xs focus:outline-none focus:ring-2 placeholder:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed`;
  
  // Clases del label
  const baseLabelClasses = `block text-sm mb-2 ${labelColor}`;

  return (
    <div className={containerClassName || "mb-4"}>
      {label && (
        <label 
          htmlFor={id || name} 
          className={labelClassName || baseLabelClasses}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        title={title}
        autoComplete={autoComplete}
        aria-invalid={error}
        aria-describedby={
          error && errorMessage ? `${id || name}-error` :
          helpText ? `${id || name}-help` :
          undefined
        }
        className={`${baseInputClasses} ${borderClass} ${focusRingClass} ${className}`}
      />
      {/* Mensaje de error */}
      {error && errorMessage && (
        <p 
          id={`${id || name}-error`}
          className="mt-1 text-sm text-red-400"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      {/* Texto de ayuda (solo se muestra si no hay error) */}
      {!error && helpText && (
        <p 
          id={`${id || name}-help`}
          className="mt-1 text-xs text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
}


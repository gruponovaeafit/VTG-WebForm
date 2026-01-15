"use client";

import React from "react";
import Image from "next/image";

type ButtonTheme = "default" | "fifa" | "china";
type ButtonVariant = "amarillo" | "azul" | "rojo" | "naranja" | "verde";
type ButtonSize = "sm" | "md" | "lg";
type ButtonState = "active" | "disabled" | "loading";
type ButtonType = "button" | "submit" | "reset";

type ButtonProps = {
  children: React.ReactNode;

  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  type?: ButtonType;

  // Hace girar el balón (tema 'fifa') tras el click hasta que la vista cambie
  spinOnClick?: boolean;

  show?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type ThemeConfig = {
  base: string;
  variants: Record<ButtonVariant, string>;
  sizes: Record<ButtonSize, string>;
};

const themes: Record<ButtonTheme, ThemeConfig> = {
  default: {
    base:
      "w-full rounded font-bold uppercase tracking-wider transition duration-300 transform",
    variants: {
      amarillo:
        "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
      azul: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      rojo: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      naranja:
        "bg-orange-400 text-black hover:bg-orange-500 active:bg-orange-600",
      verde: "bg-green-400 text-white hover:bg-green-500 active:bg-green-600",
    },
    sizes: {
      sm: "py-2 px-3 text-sm",
      md: "py-3 px-4 text-base",
      lg: "py-4 px-6 text-lg",
    },
  },

  fifa: {
    base: `
      font-ea
      group
      relative w-full h-[72px]
      pl-10 pr-24
      rounded-tr-full
      rounded-br-full
      rounded-bl-full
      rounded-tl-sm

      flex items-center justify-center
      overflow-visible
      uppercase tracking-wide
      transition
      active:translate-y-1
    `,
    variants: {
      verde: `
        bg-[#34C759] text-white
        shadow-[0_14px_0_rgba(0,0,0,0.35)]
        hover:bg-[#2FB650]
        active:shadow-[0_8px_0_rgba(0,0,0,0.35)]
      `,
      amarillo:
        "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
      azul: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      rojo: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      naranja:
        "bg-orange-400 text-black hover:bg-orange-500 active:bg-orange-600",
    },
    sizes: {
      sm: "h-[56px] text-2xl pl-8 pr-20",
      md: "h-[72px] text-4xl pl-10 pr-16",
      lg: "h-[88px] text-5xl pl-12 pr-28",
    },
  },

  china: {
    base: `
      font-press
      w-full rounded-xl px-6 py-3
      font-bold tracking-wide
      border-2
      transition
    `,
    variants: {
      amarillo:
        "bg-yellow-200 text-red-700 border-red-600 hover:bg-yellow-300",
      azul: "bg-blue-200 text-red-700 border-red-600 hover:bg-blue-300",
      rojo: "bg-red-600 text-yellow-200 border-yellow-300 hover:bg-red-700",
      naranja:
        "bg-orange-300 text-red-700 border-red-600 hover:bg-orange-400",
      verde:
        "bg-green-600 text-yellow-200 border-yellow-300 hover:bg-green-700",
    },
    sizes: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
};

export default function Button({
  children,
  theme = "default",
  variant = "amarillo",
  size = "md",
  state = "active",
  type = "button",
  spinOnClick = true,
  show = true,
  className = "",
  onClick,
}: ButtonProps) {
  if (!show) return null;

  const isDisabled = state === "disabled" || state === "loading";
  const t = themes[theme];
  const [isSpinning, setIsSpinning] = React.useState(false);
  const spinTimerRef = React.useRef<number | null>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (spinOnClick && theme === "fifa") {
      // reinicia cualquier timer previo y gira durante 1s
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current);
      }
      setIsSpinning(true);
      spinTimerRef.current = window.setTimeout(() => {
        setIsSpinning(false);
        spinTimerRef.current = null;
      }, 900);
    }
    onClick?.(e);
  };

  React.useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={state === "loading"}
      className={[
        t.base,
        t.variants[variant],
        t.sizes[size],
        isDisabled
          ? "opacity-60 cursor-not-allowed transform-none"
          : "hover:scale-105 active:scale-95",
        className,
      ].join(" ")}
    >
      {/* TEXTO */}
      <span
        style={{
          textShadow:
            theme === "fifa"
              ? "0 6px 0 rgba(0,80,35,0.9), 0 12px 18px rgba(0,0,0,0.35)"
              : undefined,
        }}
      >
        {children}
      </span>

      {/* BALÓN FIFA — PARTE DEL DISEÑO */}
      {theme === "fifa" && (
        <span
          className="
            absolute right-[-40px] top-1/2 -translate-y-1/2
            w-28 h-28 rounded-full
            overflow-hidden pointer-events-none
          "
        >
          <Image
            src="/FifaBall.png"
            alt=""
            width={64}
            height={64}
            className={[
              "w-full h-full object-cover",
              state === "loading" || isSpinning
                ? "animate-[spin_0.8s_linear_infinite]"
                : "",
            ].join(" ")}
            priority
          />
        </span>
      )}
    </button>
  );
}

import React from "react";
import { cn } from "../utils/cn"; // or replace with clsx if not using cn

interface GenericButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<GenericButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  loading = false,
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-lime-400 to-teal-500 text-white hover:shadow-lg hover:shadow-lime-200 focus:ring-teal-400",
    secondary:
      "text-teal-700 bg-teal-100 hover:bg-teal-200 focus:ring-teal-300",
    outline:
      "border-2 border-gray-300 text-gray-800 hover:border-teal-500 hover:text-teal-600 focus:ring-teal-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        <>
          {icon && <span className="mr-1">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

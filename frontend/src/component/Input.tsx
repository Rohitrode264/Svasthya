import React from "react";
import { cn } from "../utils/cn"; // optional helper for merging classes
import { type LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  helperText,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div
        className={cn(
          "flex items-center w-full px-4 py-2 rounded-xl border transition-all duration-300",
          "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-400",
          "bg-white/70 backdrop-blur-sm shadow-sm",
          error
            ? "border-red-300 focus-within:ring-red-300"
            : "border-gray-200 hover:border-lime-300",
          className
        )}
      >
        {Icon && <Icon className="w-5 h-5 text-teal-500 mr-3" strokeWidth={1.5} />}
        <input
          {...props}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Helper / Error */}
      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : (
        helperText && <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
};

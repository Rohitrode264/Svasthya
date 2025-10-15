"use client";
import React from "react";
import Logo from "./Logo";

interface GlassCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Card: React.FC<GlassCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="relative w-full max-w-md bg-white/40 backdrop-blur-2xl border border-lime-100 rounded-3xl shadow-xl px-8 py-10 space-y-6">
      <div className="absolute top-4 left-4 flex items-center space-x-1">
        <Logo size={32}/>
        <span className="text-sm font-semibold text-gray-800 tracking-wide">
          Svasthya
        </span>
      </div>

      {title && (
        <h2 className="text-2xl font-bold text-gray-900 text-center pt-8">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 text-center -mt-2">{subtitle}</p>
      )}

      <div className="space-y-4">{children}</div>
    </div>
  );
};

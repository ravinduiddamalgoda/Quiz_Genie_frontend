// components/background-gradient.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: React.ElementType;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  className,
  containerClassName,
  as: Component = "div",
}) => {
  return (
    <Component
      className={cn(
        "relative p-[4px] group overflow-hidden",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-0 transition duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500 to-blue-300 rounded-xl blur-lg",
          containerClassName
        )}
      />
      <div
        className={cn(
          "relative z-10 bg-white rounded-[20px] h-full",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};
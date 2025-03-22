// components/3d-card.tsx
"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { cn } from "@/lib/utils";

type MouseEnterContextType = boolean;
const MouseEnterContext = createContext<MouseEnterContextType>(false);

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardItemProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  [key: string]: any;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className,
  containerClassName,
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
    containerRef.current.style.transition = "transform 0.1s ease";
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (!containerRef.current) return;
    containerRef.current.style.transition = "transform 0.5s ease";
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseEnterContext.Provider value={isMouseEntered}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-transform duration-200 ease-out",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "h-full w-full p-5 rounded-xl flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem: React.FC<CardItemProps> = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const isMouseEntered = useContext(MouseEnterContext);

  const transform = isMouseEntered
    ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : "translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0)";

  return (
    <Tag
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{
        transform,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
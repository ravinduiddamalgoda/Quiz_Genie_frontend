// components/floating-navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  link: string;
}

interface FloatingNavProps {
  items: NavItem[];
  className?: string;
}

interface FloatingNavItemProps {
  item: NavItem;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ 
  items, 
  className 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-4 inset-x-0 mx-auto z-50 w-fit transition-all duration-300",
        isScrolled ? "bg-white shadow-md rounded-full" : "bg-transparent",
        className
      )}
    >
      <div className="flex items-center justify-center h-12 px-8">
        {items.map((item, index) => (
          <FloatingNavItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export const FloatingNavItem: React.FC<FloatingNavItemProps> = ({ item }) => {
  return (
    <a
      href={item.link}
      className="relative px-4 py-2 text-sm text-blue-900 transition-colors hover:text-blue-600"
    >
      <span>{item.name}</span>
    </a>
  );
};
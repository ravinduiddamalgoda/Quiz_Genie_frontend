// components/ui/text-generate-effect.tsx
"use client";

import React, { useEffect, useState } from "react";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({ 
  words, 
  className 
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (currentIndex >= words.length) {
      setIsComplete(true);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + words[currentIndex]);
      setCurrentIndex(currentIndex + 1);
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentIndex, words]);

  return (
    <span className={className}>
      {isComplete ? words : displayedText}
      {!isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};
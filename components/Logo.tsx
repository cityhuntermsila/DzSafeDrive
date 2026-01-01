import React from 'react';

export const Logo: React.FC<{ className?: string; hideText?: boolean }> = ({ className = "", hideText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Part: Red Shield with white cutout */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <path 
            d="M20,15 L80,15 C85,15 90,20 90,25 L90,75 C90,85 80,95 70,95 L20,95 C15,95 10,90 10,85 L10,25 C10,20 15,15 20,15" 
            fill="#DC2626" 
          />
          <path 
            d="M45,35 L65,35 L65,55 C65,65 55,75 45,75 C35,75 25,65 25,55 L25,35 L45,35" 
            fill="white" 
            className="opacity-90"
          />
          <circle cx="15" cy="85" r="8" fill="#DC2626" />
        </svg>
      </div>
      
      {!hideText && (
        <span className="text-2xl font-black tracking-tighter flex items-center">
          <span className="text-[#0F172A]">DzSafe</span>
          <span className="text-[#DC2626]">-DRIVE</span>
        </span>
      )}
    </div>
  );
};
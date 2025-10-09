"use client";

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AnimatedBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-30px, -30px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
        }
        
        @keyframes floatAlt {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(40px, 40px) scale(1.3);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
        }
        
        .floating-dot {
          position: absolute;
          border-radius: 50%;
          animation: float linear infinite;
        }
        
        .floating-dot-alt {
          position: absolute;
          border-radius: 50%;
          animation: floatAlt linear infinite;
        }
      `}</style>
      
      {[...Array(25)].map((_, i) => {
        const size = Math.random() * 150 + 100; // 100-250px
        const isAlt = i % 2 === 0;
        const animationClass = isAlt ? 'floating-dot-alt' : 'floating-dot';
        
        const style: React.CSSProperties = {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: isDarkMode 
            ? `radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 100%)`
            : `radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 100%)`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${Math.random() * 15 + 15}s`,
          filter: `blur(${Math.random() * 20 + 15}px)`,
        };
        
        return (
          <div 
            key={i} 
            className={animationClass}
            style={style}
          />
        );
      })}
    </div>
  );
};

export default AnimatedBackground;
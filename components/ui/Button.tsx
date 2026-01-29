import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-serif tracking-wide uppercase transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-purple-900 border-purple-900 text-white hover:bg-purple-800 hover:border-purple-800 shadow-md hover:shadow-xl",
    secondary: "bg-red-900 border-red-900 text-white hover:bg-red-800 hover:border-red-800 shadow-md", // Botão de destaque/paixão
    outline: "border-gold-700 text-gold-800 bg-transparent hover:bg-gold-700 hover:text-white",
    ghost: "border-transparent text-stone-600 hover:text-purple-900 hover:bg-paper-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs font-bold rounded-sm",
    md: "px-8 py-3 text-sm font-bold rounded-sm", // Rounded-sm para parecer mais formal/papel
    lg: "px-10 py-4 text-base font-bold rounded-md",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2 relative z-10">
        {children}
      </span>
    </button>
  );
};
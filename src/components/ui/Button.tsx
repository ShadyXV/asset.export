import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'secondary', 
  size = 'md', 
  isLoading, 
  children, 
  disabled, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 select-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-sm",
    secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700",
    ghost: "hover:bg-[#1C1C1E] text-zinc-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };
  
  const sizes = {
    sm: "h-7 px-3 py-1 text-xs",
    md: "h-8 px-4 py-1.5 text-xs font-semibold",
    lg: "h-10 px-8 text-sm",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

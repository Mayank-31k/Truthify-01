
import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6 sm:p-8 transition-all-300 w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

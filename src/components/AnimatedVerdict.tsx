
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useTheme } from './ThemeProvider';

interface AnimatedVerdictProps {
  verdict: 'real' | 'fake' | null;
  confidence?: number;
  explanation?: string;
  className?: string;
}

const AnimatedVerdict: React.FC<AnimatedVerdictProps> = ({ 
  verdict, 
  confidence = 0,
  explanation = "",
  className 
}) => {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (verdict) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [verdict]);

  if (!visible) return null;

  const isReal = verdict === 'real';
  const colorClass = isReal ? 'truth' : 'fake';
  const Icon = isReal ? CheckCircle : AlertTriangle;
  const text = isReal ? 'REAL' : 'FAKE';
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "flex flex-col items-center justify-center p-6",
        className
      )}
    >
      <motion.div 
        className={cn(
          "rounded-full p-4 mb-5",
          isReal ? "bg-truth/20 text-truth" : "bg-fake/20 text-fake"
        )}
        initial={{ scale: 0.5 }}
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: isReal ? [0, 5, 0] : [0, -5, 0, 5, 0]
        }}
        transition={{ 
          duration: isReal ? 2 : 0.5, 
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: isReal ? 1 : 0.2
        }}
      >
        <Icon size={40} strokeWidth={2.5} />
      </motion.div>
      
      <motion.h2 
        className={cn(
          "text-4xl font-bold tracking-tight mb-2",
          isReal ? "text-truth" : "text-fake"
        )}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {text}
      </motion.h2>
      
      {confidence > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-[200px] mb-5"
        >
          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={cn(
                "absolute left-0 top-0 h-full rounded-full",
                isReal ? "bg-truth" : "bg-fake"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${(confidence * 100).toFixed(0)}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <motion.span 
              className="text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {(confidence * 100).toFixed(0)}%
            </motion.span>
          </div>
        </motion.div>
      )}

      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className={cn(
            "relative text-center text-sm mt-4 p-6 rounded-lg border backdrop-blur-sm w-full",
            isReal 
              ? "border-truth/20 bg-truth/5" 
              : "border-fake/20 bg-fake/5"
          )}
        >
          <motion.div 
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 rounded-full transition-theme",
              theme === "dark" ? "bg-background" : "bg-background"
            )}
            animate={{ 
              y: [0, -3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Info size={16} className={isReal ? "text-truth" : "text-fake"} />
          </motion.div>
          <p className="text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedVerdict;


import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

const Spinner = ({ size = "md", className }: SpinnerProps) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={cn(
        "rounded-full border-transparent border-t-primary animate-none",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Spinner;

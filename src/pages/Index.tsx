
import { useState, useEffect } from 'react';
import TruthChecker from '@/components/TruthChecker';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: 180,
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-block mb-4 rounded-full p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
        >
          <ShieldCheck 
            size={32}
            className="text-purple-500" 
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-500 via-blue-400 to-primary bg-clip-text text-transparent"
        >
          Truthify
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <p className="text-xl text-muted-foreground">
            Verify if information is real or fake with AI
          </p>
          <Zap className="h-4 w-4 text-primary animate-pulse" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full"
      >
        <TruthChecker />
      </motion.div>
    </div>
  );
};

export default Index;

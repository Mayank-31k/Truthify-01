import { useState, useEffect } from 'react';
import TruthChecker from '@/components/TruthChecker';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, Heart, Info, CheckCircle, XCircle, X } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [showAbout, setShowAbout] = useState(true);

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

      {/* Enhanced About section positioned on the left side with close button */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="fixed left-5 top-1/4 max-w-xs bg-gradient-to-br from-primary/10 via-purple-500/15 to-blue-500/10 backdrop-blur-md border border-primary/20 rounded-lg p-5 shadow-lg hover:shadow-primary/20 transition-all duration-300 z-10"
          >
            {/* Close button */}
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-2 right-2 p-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors duration-200"
              aria-label="Close about section"
            >
              <X className="h-4 w-4 text-foreground/70" />
            </button>
            
            <motion.div 
              className="absolute -z-10 inset-0 rounded-lg opacity-20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-xl" />
            </motion.div>
            
            <div className="flex flex-col gap-3">
              <motion.div 
                className="flex items-center gap-2 mb-1"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <div className="bg-primary/20 p-1.5 rounded-full">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">About Truthify</h3>
              </motion.div>
              
              <motion.p 
                className="text-sm text-foreground/90 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                Truthify is an AI-powered fact-checking and content verification platform that helps users determine if information is real or fake. Using advanced AI models, Truthify analyzes both text and images to detect misinformation, manipulated content, and fake news.
              </motion.p>
              
              <motion.div
                className="flex flex-col gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs">Advanced text analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs">Image verification technology</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs">Real-time results with confidence scores</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button to show About section when hidden */}
      {!showAbout && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed left-5 top-5 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200 z-10"
          onClick={() => setShowAbout(true)}
          aria-label="Show about section"
        >
          <Info className="h-5 w-5 text-primary" />
        </motion.button>
      )}

      {/* Credit box positioned on the right side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="fixed right-5 bottom-5 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-3 w-3 text-red-500" />
          <span>made with love by Mayank Kumar</span>
        </div>
      </motion.div>

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
          <img 
            src="/favicon.svg" 
            alt="Truthify Logo" 
            className="w-8 h-8"
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

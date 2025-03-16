import React, { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "./Spinner";
import GlassCard from "./GlassCard";
import AnimatedVerdict from "./AnimatedVerdict";
import { verifyInformation } from "@/utils/aiService";
import { verifyImage } from "@/utils/imageAnalysisService";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Brain, ImageIcon, FilePlus2, FileX2, Text, FileText, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TruthChecker: React.FC = () => {
  const [text, setText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verdict, setVerdict] = useState<'real' | 'fake' | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("text");
  const [showPatientMessage, setShowPatientMessage] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    if (verdict) {
      setVerdict(null);
      setExplanation("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      if (verdict) {
        setVerdict(null);
        setExplanation("");
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVerify = async () => {
    if (activeTab === "text") {
      if (!text.trim()) {
        toast({
          title: "Empty input",
          description: "Please enter some text to verify.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsVerifying(true);
        setVerdict(null);
        setExplanation("");
        
        const result = await verifyInformation(text);
        
        setVerdict(result.verdict);
        setConfidence(result.confidence);
        setExplanation(result.explanation || "");
      } catch (error) {
        console.error("Error verifying information:", error);
        toast({
          title: "Verification failed",
          description: "There was an error processing your request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    } else {
      if (!selectedImage) {
        toast({
          title: "No image selected",
          description: "Please select an image to verify.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsVerifying(true);
        setVerdict(null);
        setExplanation("");
        setExtractedText(null);
        
        const result = await verifyImage(selectedImage);
        
        setVerdict(result.verdict);
        setConfidence(result.confidence);
        setExplanation(result.explanation || "");
        
        if (result.extractedText) {
          setExtractedText(result.extractedText);
        }
      } catch (error) {
        console.error("Error verifying image:", error);
        toast({
          title: "Image verification failed",
          description: "There was an error processing your image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVerdict(null);
    setExplanation("");
    setText("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GlassCard className={`transition-all duration-500 hover:shadow-lg ${verdict === 'real' ? 'border-truth/30 shadow-truth/10' : verdict === 'fake' ? 'border-fake/30 shadow-fake/10' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Sparkles className="text-primary h-6 w-6" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Truthify
          </h2>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.5
            }}
          >
            <Sparkles className="text-primary h-6 w-6" />
          </motion.div>
        </motion.div>

        <Tabs defaultValue="text" className="mb-6" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Text size={16} />
              Text Analysis
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon size={16} />
              Image Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <div className="mb-6 relative">
              <Textarea
                placeholder="Paste or type text to check if it's real or fake... For example: The Pyramids of Giza were made by aliens."
                value={text}
                onChange={handleInputChange}
                className={`min-h-[120px] resize-none transition-all duration-300 focus:shadow-md 
                  ${verdict === 'real' ? 'border-truth/30 focus:border-truth' : 
                    verdict === 'fake' ? 'border-fake/30 focus:border-fake' : 
                    'border-primary/20 focus:border-primary'}`}
              />
              <motion.div 
                className="absolute top-2 right-2 opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {verdict === 'real' && <span className="text-truth text-xs">Truth detected!</span>}
                {verdict === 'fake' && <span className="text-fake text-xs">Falsehood detected!</span>}
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="image">
            <div className="mb-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 text-center
                  ${imagePreview ? 
                    verdict === 'real' ? 'border-truth/30' : 
                    verdict === 'fake' ? 'border-fake/30' : 
                    'border-primary/30' : 
                    'border-muted hover:border-primary/40'}`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[300px] mx-auto rounded-lg object-contain"
                    />
                    <Button 
                      size="icon"
                      variant="destructive" 
                      className="absolute top-2 right-2 rounded-full opacity-70 hover:opacity-100"
                      onClick={removeSelectedImage}
                    >
                      <FileX2 size={16} />
                    </Button>
                    
                    {verdict === 'real' && (
                      <div className="absolute top-2 left-2 bg-truth/80 text-white text-xs rounded-full px-2 py-1">
                        Real
                      </div>
                    )}
                    
                    {verdict === 'fake' && (
                      <div className="absolute top-2 left-2 bg-fake/80 text-white text-xs rounded-full px-2 py-1">
                        Fake
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="mb-4 text-muted-foreground"
                    >
                      <FilePlus2 size={48} />
                    </motion.div>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop an image here or click to browse
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="bg-primary/10 hover:bg-primary/20"
                    >
                      <ImageIcon className="mr-2" size={16} />
                      Select Image
                    </Button>
                  </div>
                )}
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleVerify}
            disabled={isVerifying || (activeTab === "text" ? !text.trim() : !selectedImage)}
            size="lg"
            className={`px-8 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg 
              hover:-translate-y-0.5 active:translate-y-0
              ${verdict === 'real' ? 'bg-gradient-to-r from-truth to-green-400 hover:from-green-500 hover:to-truth' : 
                verdict === 'fake' ? 'bg-gradient-to-r from-fake to-orange-500 hover:from-red-600 hover:to-fake' : 
                'bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary'}`}
          >
            {isVerifying ? (
              <>
                <Spinner 
                  size="sm" 
                  className={`mr-2 ${verdict === 'real' ? 'border-t-truth' : verdict === 'fake' ? 'border-t-fake' : 'border-t-primary'}`} 
                />
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Analyzing...
                </motion.span>
              </>
            ) : (
              <>
                <Search className="mr-1" />
                Verify
              </>
            )}
          </Button>
        </div>
        
        <AnimatePresence mode="wait">
          {(verdict || isVerifying) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`mt-8 pt-6 border-t ${
                verdict === 'real' ? 'border-truth/20' : 
                verdict === 'fake' ? 'border-fake/20' : 
                'border-primary/10'
              }`}
            >
              {isVerifying ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-4 text-primary"
                  >
                    <Brain size={48} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-lg font-medium bg-gradient-to-r from-primary/80 to-blue-400/80 bg-clip-text text-transparent">
                      Truthify is analyzing {activeTab === "image" ? "your image" : "your text"}...
                    </p>
                  </motion.div>
                  <motion.div 
                    className="mt-4 flex gap-1"
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          delay: i * 0.15
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              ) : (
                <AnimatedVerdict 
                  verdict={verdict} 
                  confidence={confidence} 
                  explanation={explanation}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-center mt-4 text-muted-foreground"
      >
        <a 
          href="https://github.com/Mayank-31k/Truthify-01" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-200 hover:underline flex items-center justify-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
          GitHub Repository
        </a>
      </motion.p>

      {/* Patient message box */}
      <AnimatePresence>
        {showPatientMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative mt-4 mx-auto max-w-md bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-center"
          >
            <button 
              onClick={() => setShowPatientMessage(false)}
              className="absolute top-1 right-1 p-1 rounded-full hover:bg-blue-500/10 transition-colors"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4 text-blue-500/70" />
            </button>
            <p className="text-xs text-blue-500 font-medium">
              Truthify can take time. Be patient for the truth
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTab === "image" && extractedText && verdict && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <GlassCard className="backdrop-blur-md">
              <div className="flex items-center gap-2 text-primary mb-2">
                <FileText size={16} />
                <h3 className="font-medium">Extracted Text</h3>
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto p-4 bg-secondary/20 rounded-lg">
                {extractedText}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TruthChecker;

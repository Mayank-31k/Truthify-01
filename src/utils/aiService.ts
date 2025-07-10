// AI-powered information verification service using DeepSeek

import { toast } from "@/components/ui/use-toast";

interface VerificationResult {
  verdict: 'real' | 'fake';
  confidence: number;
  explanation?: string;
}

// Function to verify information using the DeepSeek AI model API
export const verifyInformation = async (text: string): Promise<VerificationResult> => {
  try {
    
    const API_URL = "https://api.deepseek.com/v1/chat/completions";
    
    
    const apiKey = "sk-70c6006277d944689c59be834b6fae3b";
    
    // Make request to the DeepSeek API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert fact-checker and content authenticity analyst. Your task is to analyze provided text and determine if it contains factual, accurate information or if it might be misleading, false, or fake news. Focus on identifying inconsistencies, verifiable facts, and potential misinformation patterns."
          },
          {
            role: "user",
            content: `Analyze this text and determine if it appears to be real (factual/truthful) or fake (misleading/false). Respond with ONLY: "real" or "fake", followed by a confidence score between 0 and 1, and then a brief explanation of your analysis. Text to analyze: "${text}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      } else {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText || 'Unknown error'}`);
      }
    }
    
    const data = await response.json();
    
    // Parse the AI response
    const aiResponse = data.choices[0].message.content.trim();
    
    // Extract verdict, confidence, and explanation using regex
    const match = aiResponse.match(/^(real|fake)[^\d]*(0\.\d+|\d+\.\d+|\d+)[^\w]*(.*)/i);
    
    if (match) {
      const [, verdict, confidenceStr, explanation] = match;
      const confidence = parseFloat(confidenceStr);
      
      return {
        verdict: verdict.toLowerCase() as 'real' | 'fake',
        confidence: isNaN(confidence) ? 0.7 : confidence,
        explanation: explanation.trim()
      };
    }
    
    // Fallback if parsing fails
    return {
      verdict: aiResponse.toLowerCase().includes('real') ? 'real' : 'fake',
      confidence: 0.7,
      explanation: aiResponse
    };
  } catch (error) {
    console.error("Error verifying information:", error);
    
    toast({
      title: "API Connection Issue",
      description: "Unable to perform full analysis. Please try again later.",
      duration: 5000,
    });
    
    return {
      verdict: 'fake',
      confidence: 0.5,
      explanation: `Error analyzing text: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Function to check if the API key is available
export const hasApiKey = (): boolean => {
  return true; // API key is hardcoded for now
};

// Function to save the DeepSeek API key to localStorage
export const saveApiKey = (key: string): void => {
  // This function is kept for compatibility but doesn't need to do anything
  toast({
    title: "API Configuration",
    description: "API is already configured for all users."
  });
};

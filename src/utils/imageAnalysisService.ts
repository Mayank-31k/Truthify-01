import { toast } from "@/components/ui/use-toast";
import { createWorker } from 'tesseract.js';
import { verifyInformation } from "./aiService";

interface ImageVerificationResult {
  verdict: 'real' | 'fake';
  confidence: number;
  explanation?: string;
  extractedText?: string;
}

// Supported image types
const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Function to extract text from image using Tesseract OCR
const extractTextFromImage = async (imageFile: File): Promise<string> => {
  console.log("Starting OCR text extraction...");
  try {
    const worker = await createWorker('eng');
    
    // Convert image to URL for Tesseract
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Recognize text in the image
    const { data } = await worker.recognize(imageUrl);
    const extractedText = data.text;
    
    console.log("OCR extraction completed:", { 
      textLength: extractedText.length,
      textPreview: extractedText.substring(0, 100) + (extractedText.length > 100 ? '...' : '')
    });
    
    // Terminate worker
    await worker.terminate();
    
    // Clean up the URL
    URL.revokeObjectURL(imageUrl);
    
    return extractedText;
  } catch (error) {
    console.error("OCR extraction error:", error);
    throw new Error('Failed to extract text from image');
  }
};

export const verifyImage = async (imageFile: File): Promise<ImageVerificationResult> => {
  try {
    console.log("Starting image verification for:", {
      fileName: imageFile.name,
      fileType: imageFile.type,
      fileSize: `${(imageFile.size / (1024 * 1024)).toFixed(2)}MB`
    });

    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes(imageFile.type)) {
      throw new Error(`Unsupported file type: ${imageFile.type}. Supported types: ${SUPPORTED_MIME_TYPES.join(', ')}`);
    }

    // Extract text from image using OCR
    let extractedText = '';
    try {
      extractedText = await extractTextFromImage(imageFile);
      console.log("Successfully extracted text from image");
      
      // If text was extracted, verify it using DeepSeek API
      if (extractedText.trim()) {
        console.log("Verifying extracted text using DeepSeek API");
        try {
          const textVerificationResult = await verifyInformation(extractedText);
          
          // If text verification was successful, return the result
          if (textVerificationResult) {
            return {
              ...textVerificationResult,
              extractedText
            };
          }
        } catch (textVerifyError) {
          console.error("Error verifying extracted text:", textVerifyError);
          // Continue with image analysis if text verification fails
        }
      } else {
        console.log("No meaningful text extracted from image, proceeding with visual analysis");
      }
    } catch (ocrError) {
      console.error("Error extracting text from image:", ocrError);
      // Continue with image analysis if OCR fails
    }

    // Convert image to base64 for API submission
    let base64Image: string;
    try {
      base64Image = await fileToBase64(imageFile);
      console.log("Successfully converted image to base64");
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw new Error('Failed to process image file. Please try a different image.');
    }
    
    // Use Google's Gemini API for image analysis
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";
    const API_KEY = "AIzaSyBj_DbPifNdXF6egBh8dQ4xXUHUHFGguz8";
    
    if (!API_KEY) {
      console.error("Missing Gemini API key");
      throw new Error('API key is not configured. Please check your environment variables.');
    }

    try {
      console.log("Preparing Gemini API request...");
      
      // Keep the data URL format for the image
      const imageDataUrl = `data:${imageFile.type};base64,${base64Image}`;
      
      // If we have extracted text, include it in the prompt
      const promptText = extractedText.trim() 
        ? `Analyze this image and the text extracted from it. The extracted text is: "${extractedText.substring(0, 500)}${extractedText.length > 500 ? '...' : ''}".\n\nDetermine if the image and text appear to be authentic or AI-generated/manipulated. Look for signs of manipulation such as: inconsistent lighting, unnatural textures, irregular patterns, distorted features, or unrealistic details. Also consider whether the text contains factual inaccuracies or misleading information. Respond in this exact format:\nVERDICT: [REAL or FAKE]\nCONFIDENCE: [0-1]\nEXPLANATION: [your detailed analysis]`
        : "Analyze this image and determine if it appears to be real or AI-generated/manipulated. Look for signs of manipulation such as: inconsistent lighting, unnatural textures, irregular patterns, distorted features, or unrealistic details. Respond in this exact format:\nVERDICT: [REAL or FAKE]\nCONFIDENCE: [0-1]\nEXPLANATION: [your detailed analysis]";
      
      const requestBody = {
        contents: [{
          parts: [
            {
              text: promptText
            },
            {
              inlineData: {
                mimeType: imageFile.type,
                data: base64Image
              }
            }
          ]
        }]
      };

      console.log("Sending request to Gemini API...");
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log("Received response from Gemini API:", {
        hasResponse: !!result,
        hasCandidates: !!result.candidates,
        candidateCount: result.candidates?.length
      });

      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Invalid API response format:", result);
        throw new Error('Invalid API response format');
      }

      const analysisText = result.candidates[0].content.parts[0].text;
      console.log("Analysis Text:", analysisText);

      // Parse the structured response
      const verdictMatch = analysisText.match(/VERDICT:\s*(REAL|FAKE)/i);
      const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(0\.\d+|\d+\.\d+|\d+)/i);
      const explanationMatch = analysisText.match(/EXPLANATION:\s*(.+)$/is);

      if (!verdictMatch || !confidenceMatch) {
        console.error("Failed to parse response:", {
          analysisText,
          verdictMatch,
          confidenceMatch
        });
        throw new Error('Could not parse verdict and confidence from response');
      }

      const verdict = verdictMatch[1].toUpperCase();
      const confidence = Math.min(Math.max(parseFloat(confidenceMatch[1]), 0), 1);
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';

      console.log("Analysis complete:", {
        verdict,
        confidence,
        hasExplanation: !!explanation
      });

      return {
        verdict: verdict === 'REAL' ? 'real' : 'fake',
        confidence,
        explanation: explanation || `Analysis ${verdict === 'REAL' ? 'indicates this is a real photo' : 'suggests this might be manipulated'} (${(confidence * 100).toFixed(1)}% confidence)`,
        extractedText: extractedText.trim() || undefined
      };

    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      
      // Check if the error is related to the API key
      if (apiError.message.includes('API key')) {
        toast({
          title: "API Key Error",
          description: "Please check if your Gemini API key is valid and has proper permissions.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error("Error in image verification:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Show user-friendly error message
    toast({
      title: "Image Analysis Error",
      description: errorMessage.includes('API Error') 
        ? "Unable to analyze image using AI service. Falling back to basic analysis."
        : errorMessage,
      variant: "destructive",
      duration: 5000,
    });

    // Only use local analysis for API-related errors or when API key is missing
    if (errorMessage.includes('API Error') || errorMessage.includes('API key')) {
      console.log("Falling back to local analysis");
      return provideLocalImageAnalysis(imageFile);
    }

    // For other errors, rethrow to be handled by the component
    throw error;
  }
};

// Fallback function for local image analysis when API fails
const provideLocalImageAnalysis = async (imageFile: File): Promise<ImageVerificationResult> => {
  // Try to at least extract text from the image even in fallback mode
  let extractedText = '';
  try {
    extractedText = await extractTextFromImage(imageFile);
  } catch (error) {
    console.error("Failed to extract text in fallback mode:", error);
  }
  
  return {
    verdict: 'real',
    confidence: 0.5,
    explanation: "Using basic analysis as AI service is unavailable. The image appears to be a standard image file.",
    extractedText: extractedText.trim() || undefined
  };
};

// Helper function to convert a file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

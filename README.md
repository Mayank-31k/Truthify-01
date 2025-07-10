# Truthify

![Truthify Logo](public/favicon.svg)

## About Truthify

Truthify is an AI-powered fact-checking and content verification platform that helps users determine if information is real or fake. Using advanced AI models, Truthify analyzes both text and images to detect misinformation, manipulated content, and fake news.

## Features

- **Text Analysis**: Verify the authenticity of text content using trained ai model
- **Image Analysis**: Detect manipulated or AI-generated images using OCR app APi
- **OCR Technology**: Extract and analyze text from images using Tesseract.js
- **Real-time Verification**: Get instant results with confidence scores
- **Detailed Explanations**: Receive comprehensive analysis explaining why content is classified as real or fake
- **Modern UI**: Beautiful, responsive interface with animations and glass-morphism design

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with ShadcnUI components
- **Animation**: Framer Motion for smooth transitions and effects
- **Particle Effects**: TSParticles for interactive background
- **OCR**: Tesseract.js for extracting text from images
- **AI Integration**: 
  
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Truthify
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Text Verification**:
   - Select the "Text Analysis" tab
   - Enter or paste the text you want to verify
   - Click "Verify" to analyze the content
   - View the verdict, confidence score, and explanation

2. **Image Verification**:
   - Select the "Image Analysis" tab
   - Upload an image by clicking the upload area or dragging and dropping
   - Click "Verify" to analyze the image
   - View the verdict, confidence score, and explanation
   - If text is detected in the image, it will be extracted and analyzed as well

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
Truthify/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # UI components from ShadcnUI
│   │   └── ...           # Custom components
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions and services
│   │   ├── aiService.ts  # Text verification service
│   │   └── imageAnalysisService.ts # Image verification service
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
└── ...                   # Configuration files
```



API keys are currently hardcoded for demonstration purposes. In a production environment, these should be stored securely using environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Made with love by Mayank Kumar and Pranjal Mann
- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

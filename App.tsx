import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ErrorAlert } from './components/ErrorAlert';
import { ai } from './services/geminiService';

export interface ImageMetadata {
  altText: string;
  title: string;
  tags: string[];
}

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  metadata: ImageMetadata | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};


const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);

  const handleImagesChange = (files: FileList | null) => {
      if (files) {
          const newImages: ImageItem[] = Array.from(files).map(file => ({
              id: Math.random().toString(36).substring(7),
              file,
              preview: URL.createObjectURL(file),
              metadata: null,
              status: 'idle'
          }));
          setImages(prev => [...prev, ...newImages]);
      }
  };

  const removeImage = (id: string) => {
      setImages(prev => {
          const imageToRemove = prev.find(img => img.id === id);
          if (imageToRemove) {
              URL.revokeObjectURL(imageToRemove.preview);
          }
          return prev.filter(img => img.id !== id);
      });
  };

  const generateMetadataForItem = async (id: string) => {
    const item = images.find(img => img.id === id);
    if (!item || item.status === 'loading') return;

    setImages(prev => prev.map(img => img.id === id ? { ...img, status: 'loading', error: undefined } : img));

    const schema = {
      type: Type.OBJECT,
      properties: {
        altText: {
          type: Type.STRING,
          description: "A detailed and descriptive alternative text for the image, crucial for accessibility and SEO."
        },
        title: {
          type: Type.STRING,
          description: "A catchy and relevant title for the image."
        },
        tags: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "A list of 5-10 relevant keywords or tags that describe the image content, style, and subject matter."
        },
      },
      required: ['altText', 'title', 'tags'],
    };

    const prompt = `You are an expert in SEO and image analysis. Analyze the following image and generate optimal metadata for it: a detailed alt text for accessibility, a catchy title, and a list of relevant tags.`;

    try {
        const base64Data = await fileToBase64(item.file);
        const imagePart = {
          inlineData: {
            mimeType: item.file.type,
            data: base64Data,
          },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{text: prompt}, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const parsedMetadata = JSON.parse(response.text) as ImageMetadata;
        setImages(prev => prev.map(img => img.id === id ? { ...img, metadata: parsedMetadata, status: 'success' } : img));

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setImages(prev => prev.map(img => img.id === id ? { ...img, status: 'error', error: errorMessage } : img));
    }
  };

  const handleGenerateAll = async () => {
    setIsProcessingAll(true);
    const idleImages = images.filter(img => img.status === 'idle' || img.status === 'error');
    
    // Process in batches or all at once? Let's do all at once for now but with a limit if needed.
    // For simplicity, we'll trigger them all.
    await Promise.all(idleImages.map(img => generateMetadataForItem(img.id)));
    setIsProcessingAll(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-5">
                <InputPanel
                    onImagesChange={handleImagesChange}
                    images={images}
                    onRemoveImage={removeImage}
                    onGenerateAll={handleGenerateAll}
                    isProcessing={isProcessingAll}
                />
            </div>
            <div className="lg:col-span-7">
                <OutputPanel
                    images={images}
                    onGenerateItem={generateMetadataForItem}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
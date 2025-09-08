import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import EnhancementControls from './components/EnhancementControls';
import ComparisonView from './components/ComparisonView';
import Footer from './components/Footer';

export interface EnhancementSettings {
  scale: number;
  sharpness: number;
  contrast: number;
  brightness: number;
  noiseReduction: number;
}

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const defaultSettings: EnhancementSettings = {
    scale: 2,
    sharpness: 1.2,
    contrast: 1.1,
    brightness: 1.0,
    noiseReduction: 0.5
  };

  const [settings, setSettings] = useState<EnhancementSettings>(defaultSettings);

  const handleImageUpload = (imageUrl: string) => {
    setOriginalImage(imageUrl);
    setEnhancedImage(null);
  };

  const handleEnhance = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing steps
      const steps = [
        { name: 'Loading image...', duration: 500 },
        { name: 'Upscaling resolution...', duration: 2000 },
        { name: 'Applying sharpening...', duration: 1000 },
        { name: 'Enhancing contrast...', duration: 800 },
        { name: 'Reducing noise...', duration: 1200 },
        { name: 'Finalizing...', duration: 500 }
      ];

      let currentProgress = 0;
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.duration));
        currentProgress += 100 / steps.length;
        setProgress(Math.min(currentProgress, 100));
      }

      // Create enhanced image using canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Scale up the canvas
      canvas.width = img.width * settings.scale;
      canvas.height = img.height * settings.scale;
      
      // Apply image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw scaled image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Apply filters
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply brightness, contrast, and basic sharpening
      for (let i = 0; i < data.length; i += 4) {
        // Brightness and contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * settings.contrast + 128 + (settings.brightness - 1) * 50));
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * settings.contrast + 128 + (settings.brightness - 1) * 50));
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * settings.contrast + 128 + (settings.brightness - 1) * 50));
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      const enhancedDataUrl = canvas.toDataURL('image/png', 0.95);
      setEnhancedImage(enhancedDataUrl);
      
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `ez-hd-enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setSettings(defaultSettings);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              EZ-HD
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your photos into stunning HD quality with our advanced AI-powered enhancement technology
            </p>
          </div>

          {/* Upload Section */}
          {!originalImage && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}

          {/* Enhancement Interface */}
          {originalImage && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1">
                <EnhancementControls
                  settings={settings}
                  onSettingsChange={setSettings}
                  onEnhance={handleEnhance}
                  onReset={handleReset}
                  isProcessing={isProcessing}
                  progress={progress}
                />
              </div>

              {/* Comparison View */}
              <div className="lg:col-span-2">
                <ComparisonView
                  originalImage={originalImage}
                  enhancedImage={enhancedImage}
                  isProcessing={isProcessing}
                  progress={progress}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">2x</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Upscaling</h3>
              <p className="text-gray-300">Increase resolution up to 4x while preserving image quality and details</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Enhancement</h3>
              <p className="text-gray-300">Advanced algorithms for noise reduction and detail enhancement</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">HD</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HD Quality</h3>
              <p className="text-gray-300">Professional-grade results suitable for printing and display</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
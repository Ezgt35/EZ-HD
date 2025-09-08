import React, { useState } from 'react';
import { Download, Eye, EyeOff, Loader } from 'lucide-react';

interface ComparisonViewProps {
  originalImage: string;
  enhancedImage: string | null;
  isProcessing: boolean;
  progress: number;
  onDownload: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalImage,
  enhancedImage,
  isProcessing,
  progress,
  onDownload
}) => {
  const [showComparison, setShowComparison] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Preview</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
          </button>
          
          {enhancedImage && (
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download HD</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="text-center space-y-4">
                <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-white font-medium">Enhancing your photo...</p>
                  <div className="w-64 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">{Math.round(progress)}% complete</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Original Image */}
              <img
                src={originalImage}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Enhanced Image with Comparison Slider */}
              {enhancedImage && showComparison && (
                <>
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={enhancedImage}
                      alt="Enhanced"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Slider */}
                  <div className="absolute inset-0 flex items-center">
                    <div 
                      className="absolute w-1 bg-white shadow-lg z-10"
                      style={{ left: `${sliderPosition}%`, height: '100%' }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
                  />

                  {/* Labels */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                    Original
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                    Enhanced
                  </div>
                </>
              )}

              {/* Enhanced Image Only */}
              {enhancedImage && !showComparison && (
                <img
                  src={enhancedImage}
                  alt="Enhanced"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}

              {/* Placeholder when no enhanced image */}
              {!enhancedImage && !isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-gray-400">Enhanced image will appear here</p>
                    <p className="text-gray-500 text-sm">Adjust settings and click "Enhance Photo"</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Image Info */}
        {originalImage && (
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Original Image Loaded</span>
            {enhancedImage && (
              <span className="text-green-400">✓ Enhanced Version Ready</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
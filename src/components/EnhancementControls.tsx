import React from 'react';
import { Settings, Zap, RotateCcw, Download } from 'lucide-react';
import { EnhancementSettings } from '../App';

interface EnhancementControlsProps {
  settings: EnhancementSettings;
  onSettingsChange: (settings: EnhancementSettings) => void;
  onEnhance: () => void;
  onReset: () => void;
  isProcessing: boolean;
  progress: number;
}

const EnhancementControls: React.FC<EnhancementControlsProps> = ({
  settings,
  onSettingsChange,
  onEnhance,
  onReset,
  isProcessing,
  progress
}) => {
  const handleSettingChange = (key: keyof EnhancementSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Enhancement Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Scale */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Resolution Scale: {settings.scale}x
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={settings.scale}
            onChange={(e) => handleSettingChange('scale', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1x</span>
            <span>2x</span>
            <span>3x</span>
            <span>4x</span>
          </div>
        </div>

        {/* Sharpness */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Sharpness: {settings.sharpness.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.sharpness}
            onChange={(e) => handleSettingChange('sharpness', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Contrast: {settings.contrast.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.contrast}
            onChange={(e) => handleSettingChange('contrast', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Brightness: {settings.brightness.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.brightness}
            onChange={(e) => handleSettingChange('brightness', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Noise Reduction */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Noise Reduction: {settings.noiseReduction.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.noiseReduction}
            onChange={(e) => handleSettingChange('noiseReduction', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Processing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onEnhance}
          disabled={isProcessing}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <Zap className="w-5 h-5 mr-2" />
          {isProcessing ? 'Enhancing...' : 'Enhance Photo'}
        </button>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default EnhancementControls;
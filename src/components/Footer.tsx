import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">EZ-HD</h3>
            <p className="text-gray-400 text-sm">
              Professional photo enhancement made simple. Transform your images into stunning HD quality with advanced AI technology.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-medium text-white">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• AI-powered upscaling up to 4x</li>
              <li>• Advanced noise reduction</li>
              <li>• Smart sharpening algorithms</li>
              <li>• Real-time preview</li>
              <li>• High-quality downloads</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-medium text-white">Supported Formats</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• JPEG / JPG</li>
              <li>• PNG</li>
              <li>• WebP</li>
              <li>• Max size: 10MB</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for better photos</span>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              © 2024 EZ-HD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
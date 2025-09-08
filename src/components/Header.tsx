import React from 'react';
import { Camera, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EZ-HD</h1>
              <p className="text-sm text-gray-400">Photo Enhancement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Powered by Advanced AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
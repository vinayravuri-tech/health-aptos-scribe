
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-6 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-medical-primary" />
            <span className="text-lg font-semibold text-medical-dark">HealthScribe</span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Secure medical summaries on Aptos blockchain.</p>
            <p>© {new Date().getFullYear()} HealthScribe. All rights reserved.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-medical-primary">Terms</a>
            <a href="#" className="text-gray-500 hover:text-medical-primary">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-medical-primary">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

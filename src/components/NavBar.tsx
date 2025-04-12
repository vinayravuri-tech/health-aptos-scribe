
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  return (
    <nav className="border-b border-gray-200 py-4 bg-white">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-medical-primary" />
          <span className="text-xl font-bold text-medical-dark">HealthScribe</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              <Database className="h-4 w-4 mr-2" />
              My Records
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

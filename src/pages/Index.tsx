
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Database, Check, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-medical-light">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-medical-secondary rounded-full text-medical-primary font-medium text-sm">
                  AI + Blockchain Healthcare
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-medical-dark leading-tight">
                  Your Health Data, <br />
                  <span className="text-medical-primary">Secured by Blockchain</span>
                </h1>
                <p className="text-lg text-gray-600">
                  HealthScribe uses AI to diagnose symptoms and creates secure, private medical NFTs on the Aptos blockchain - giving you control of your health data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-medical-primary hover:bg-medical-primary/90 text-white">
                    <Link to="/chat">
                      <Heart className="h-4 w-4 mr-2" />
                      Check Symptoms
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">
                      <Database className="h-4 w-4 mr-2" />
                      View Health Records
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 md:p-8 border border-gray-100">
                  <div className="absolute -top-3 -right-3 bg-medical-accent text-white rounded-full px-3 py-1 text-xs font-medium">
                    Secured by Aptos
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-medical-secondary flex items-center justify-center">
                        <Heart className="h-5 w-5 text-medical-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Medical Summary</h3>
                        <p className="text-sm text-gray-500">April 10, 2025</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium mb-2">Symptoms:</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Headache</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Fatigue</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Sore throat</span>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">AI Analysis:</h4>
                      <p className="text-sm text-gray-600 border-l-2 border-medical-primary pl-3 py-1 mb-4">
                        Symptoms suggest a common cold or mild viral infection. Rest, hydration, and over-the-counter pain relievers recommended.
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <Shield className="h-3 w-3 mr-1" /> NFT Minted
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Low Severity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-medical-primary/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">How HealthScribe Works</h2>
              <p className="text-gray-600">
                Our platform combines advanced AI diagnostics with blockchain security to give you control over your health data.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-medical-light p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-medical-secondary flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Symptom Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Describe your symptoms in a natural conversation with our AI health assistant to receive a preliminary analysis.
                </p>
                <Link to="/chat" className="text-medical-primary flex items-center font-medium">
                  Try it now <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="bg-medical-light p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-medical-secondary flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Medical Summary</h3>
                <p className="text-gray-600 mb-4">
                  Receive a comprehensive medical summary based on your symptoms, including possible causes and recommendations.
                </p>
                <Link to="/dashboard" className="text-medical-primary flex items-center font-medium">
                  View samples <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="bg-medical-light p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-medical-secondary flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
                <p className="text-gray-600 mb-4">
                  Mint your medical summary as a private NFT on the Aptos blockchain, ensuring secure and private storage.
                </p>
                <a href="#" className="text-medical-primary flex items-center font-medium">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-medical-primary to-blue-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Take Control of Your Health Data Today</h2>
              <p className="text-xl opacity-90 mb-8">
                Start your health journey with AI-powered symptom checking and blockchain-secured medical records.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-medical-primary hover:bg-gray-100">
                  <Link to="/chat">
                    <Check className="h-4 w-4 mr-2" />
                    Start Symptom Check
                  </Link>
                </Button>
                <Button variant="outline" asChild className="text-white border-white hover:bg-white/20">
                  <a href="#">
                    <Shield className="h-4 w-4 mr-2" />
                    How We Protect Your Data
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

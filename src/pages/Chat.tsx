
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { toast } = useToast();
  
  const handleGetSummary = () => {
    // In a real app, this would analyze chat history and generate a summary
    toast({
      title: "Medical Summary Generated",
      description: "Your symptoms have been analyzed and a summary has been created.",
      action: (
        <Link to="/dashboard">
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      ),
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-medical-dark mb-2">AI Symptom Checker</h1>
            <p className="text-gray-600">
              Describe your symptoms in a natural conversation with our AI health assistant. 
              Get instant insights and save a secure medical summary to the blockchain.
            </p>
          </div>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is not a replacement for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
            </AlertDescription>
          </Alert>
          
          <ChatInterface />
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleGetSummary}
              className="gap-2 bg-medical-accent hover:bg-medical-accent/90"
            >
              <CheckCircle className="h-4 w-4" />
              Generate Medical Summary
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;

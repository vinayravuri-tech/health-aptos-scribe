
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wallet, ExternalLink } from 'lucide-react';

type WalletConnectProps = {
  onConnect: (address: string) => void;
};

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Mock wallet connection - in a real app, this would connect to Aptos wallet
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock wallet address
    const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    setIsConnecting(false);
    setIsOpen(false);
    onConnect(mockAddress);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2 border-medical-primary text-medical-primary hover:bg-medical-primary/10"
        onClick={() => setIsOpen(true)}
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to Aptos Wallet</DialogTitle>
            <DialogDescription>
              Connect your Aptos wallet to securely mint and store your medical NFTs
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-16"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              <div className="h-8 w-8 bg-medical-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-4 w-4 text-medical-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Petra Wallet</p>
                <p className="text-xs text-gray-500">Connect to Petra Wallet</p>
              </div>
              {isConnecting && <span className="ml-auto loading animate-pulse">Connecting...</span>}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-16"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              <div className="h-8 w-8 bg-medical-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-4 w-4 text-medical-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Martian Wallet</p>
                <p className="text-xs text-gray-500">Connect to Martian Wallet</p>
              </div>
              {isConnecting && <span className="ml-auto loading animate-pulse">Connecting...</span>}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>New to Aptos?</span>
            <a href="https://aptoslabs.com/" target="_blank" rel="noopener noreferrer" className="text-medical-primary inline-flex items-center">
              Learn more <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;

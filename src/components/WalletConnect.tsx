
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wallet, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type WalletConnectProps = {
  onConnect: (address: string) => void;
};

// Store the predefined wallet credentials
const PREDEFINED_WALLET = {
  privateKey: 'ed25519-priv-0x0dc6f315d3fe97d681dadc02326dc6f10c0b07a21ec2659cd41917e78e1678b0',
  address: '0xc44428675a04509cea912d79a922da889328c739da67274abc7974d68c21de96'
};

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected in localStorage
    const connectedWallet = localStorage.getItem('connected_wallet');
    if (connectedWallet) {
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the predefined wallet address
    setIsConnecting(false);
    setIsOpen(false);
    setIsConnected(true);
    
    // Call the onConnect callback with the predefined address
    onConnect(PREDEFINED_WALLET.address);
    
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to your Aptos wallet",
    });
  };

  const handleQuickConnect = () => {
    // Directly connect using the predefined wallet without opening the dialog
    onConnect(PREDEFINED_WALLET.address);
    setIsConnected(true);
    
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to your Aptos wallet",
    });
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2 border-medical-primary text-medical-primary hover:bg-medical-primary/10"
        onClick={handleQuickConnect}
        data-wallet-connect
        disabled={isConnected}
      >
        <Wallet className="h-4 w-4" />
        {isConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
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
              disabled={isConnecting || isConnected}
            >
              <div className="h-8 w-8 bg-medical-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-4 w-4 text-medical-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Your Wallet</p>
                <p className="text-xs text-gray-500">Connect to your predefined Aptos wallet</p>
              </div>
              {isConnecting && <span className="ml-auto loading animate-pulse">Connecting...</span>}
            </Button>
            
            <div className="bg-gray-50 p-3 rounded-md border text-xs">
              <p className="font-medium text-medical-primary mb-1">Wallet Details:</p>
              <p className="text-gray-600 mb-1 break-all">
                <span className="font-medium">Address:</span> {PREDEFINED_WALLET.address.substring(0, 20)}...
              </p>
              <p className="text-gray-600 break-all">
                <span className="font-medium">Connected to:</span> Aptos Blockchain
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>Using Aptos blockchain for secure medical NFTs</span>
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

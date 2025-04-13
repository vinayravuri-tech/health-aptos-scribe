import React, { useState, useRef, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info, AlertTriangle, Stethoscope, Volume2, VolumeX, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { generateMedicalSummary } from '@/utils/summaryUtils';
import { speakText, stopSpeaking, isSpeaking } from '@/utils/speechUtils';
import mockServer from '@/services/mockServer';
import { MedicalSummary } from '@/components/SummaryCard';
import WalletConnect from '@/components/WalletConnect';

const Chat = () => {
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<MedicalSummary | null>(null);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const chatInterfaceRef = useRef<{ getMessages?: () => any[] } | null>(null);
  
  const handleGetSummary = async () => {
    const messages = chatInterfaceRef.current?.getMessages?.() || [];
    
    if (messages.length <= 1) {
      toast({
        title: "Not enough information",
        description: "Please have a conversation about your symptoms first.",
        variant: "destructive"
      });
      return;
    }
    
    const summary = generateMedicalSummary(messages);
    
    if (!mockServer.getConnectedWallet()) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to store your medical summaries as NFTs.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Processing Summary",
        description: "Generating your medical summary, please wait...",
      });
      
      const savedSummary = await mockServer.saveSummary(summary);
      setGeneratedSummary(savedSummary);
      setShowSummary(true);
      
      toast({
        title: "Medical Summary Generated",
        description: "Your symptoms have been analyzed and a summary has been created.",
        action: (
          <Link to="/dashboard">
            <Button size="sm" variant="outline">
              View All
            </Button>
          </Link>
        ),
      });
      
      await handleMintNFT(savedSummary);
      
    } catch (error) {
      toast({
        title: "Error Generating Summary",
        description: "There was an error generating your medical summary. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleMintNFT = async (summaryToMint = generatedSummary) => {
    if (!summaryToMint) return;
    
    if (!mockServer.getConnectedWallet()) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before minting an NFT.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Minting in Progress",
      description: "Creating your secure medical NFT...",
    });
    
    try {
      const mintedSummary = await mockServer.mintSummaryAsNFT(summaryToMint.id);
      setGeneratedSummary(mintedSummary);
      
      toast({
        title: "NFT Created Successfully",
        description: "Your medical data has been securely stored as an NFT in your wallet.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  const toggleSpeech = async () => {
    if (isSpeakingState) {
      stopSpeaking();
      setIsSpeakingState(false);
    } else if (generatedSummary) {
      setIsSpeakingState(true);
      const textToSpeak = `Medical Summary: You reported symptoms of ${generatedSummary.symptoms.join(', ')}. 
        ${generatedSummary.recommendation}`;
      
      try {
        await speakText(textToSpeak);
        setIsSpeakingState(false);
      } catch (error) {
        console.error("Speech error:", error);
        setIsSpeakingState(false);
        toast({
          title: "Speech Error",
          description: "There was an error with text-to-speech. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleWalletConnect = (address: string) => {
    mockServer.connectWallet(address);
    setWalletConnected(true);
    
    toast({
      title: "Wallet Connected",
      description: `Connected to wallet: ${address.substring(0, 8)}...${address.substring(address.length - 6)}`,
    });
  };
  
  useEffect(() => {
    const connectedWallet = mockServer.getConnectedWallet();
    if (connectedWallet) {
      setWalletConnected(true);
    }
    
    if (!connectedWallet) {
      const walletComponent = document.querySelector('[data-wallet-connect]');
      if (walletComponent) {
        (walletComponent as HTMLElement).click();
      } else {
        handleWalletConnect(mockServer.getDefaultWalletAddress());
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-medical-dark mb-2">AI Symptom Checker</h1>
              <p className="text-gray-600">
                Describe your symptoms in a natural conversation with our AI health assistant powered by Groq. 
                Get instant insights and treatment suggestions.
              </p>
            </div>
            <div>
              <WalletConnect onConnect={handleWalletConnect} />
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Our enhanced AI uses Groq's advanced LLMs to understand complex symptom combinations and suggest treatment options.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-green-50 border-green-200">
              <Stethoscope className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Simply describe your symptoms via text, voice, or images and ask "What should I do?" to receive treatment suggestions.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                This is not a replacement for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
              </AlertDescription>
            </Alert>
          </div>
          
          <ChatInterface ref={chatInterfaceRef} />
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {walletConnected && (
                <span className="flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-green-500" />
                  Wallet Connected
                </span>
              )}
            </div>
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
      
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-medical-accent" />
              Medical Summary
            </DialogTitle>
            <DialogDescription>
              A summary of your reported symptoms and recommended actions
            </DialogDescription>
          </DialogHeader>
          
          {generatedSummary && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Reported Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedSummary.symptoms.map((symptom, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Recommendation:</h3>
                <p className="text-sm border-l-2 border-medical-primary pl-3 py-1">
                  {generatedSummary.recommendation}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  onClick={toggleSpeech} 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                >
                  {isSpeakingState ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isSpeakingState ? 'Stop Voice' : 'Read Aloud'}
                </Button>
                
                {generatedSummary.status === 'pending' ? (
                  <Button 
                    onClick={() => handleMintNFT()} 
                    className="gap-1 bg-medical-primary hover:bg-medical-primary/90"
                    size="sm"
                    disabled={!walletConnected}
                  >
                    {!walletConnected ? 'Connect Wallet to Mint' : 'Store as NFT'}
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button size="sm" variant="outline" className="gap-1">
                      View in Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              
              {generatedSummary.status === 'minted' && generatedSummary.ownerWallet && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>Stored in wallet: {generatedSummary.ownerWallet.substring(0, 8)}...{generatedSummary.ownerWallet.substring(generatedSummary.ownerWallet.length - 6)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Chat;

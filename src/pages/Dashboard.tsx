
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SummaryCard, { MedicalSummary } from '@/components/SummaryCard';
import WalletConnect from '@/components/WalletConnect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FilterX, Search, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for medical summaries
const mockSummaries: MedicalSummary[] = [
  {
    id: '1',
    date: 'April 10, 2025',
    title: 'Cold & Flu Symptoms',
    description: 'Patient reported headache, sore throat, and fatigue lasting 2 days.',
    symptoms: ['Headache', 'Sore throat', 'Fatigue'],
    recommendation: 'Rest, hydration, and over-the-counter pain relievers recommended. Monitor for fever development.',
    severity: 'low',
    status: 'minted'
  },
  {
    id: '2',
    date: 'March 25, 2025',
    title: 'Back Pain Assessment',
    description: 'Patient reported lower back pain that worsens with prolonged sitting.',
    symptoms: ['Lower back pain', 'Stiffness', 'Pain when bending'],
    recommendation: 'Apply heat/ice, gentle stretching exercises, and consider over-the-counter anti-inflammatory medication.',
    severity: 'medium',
    status: 'pending'
  },
  {
    id: '3',
    date: 'March 12, 2025',
    title: 'Allergy Symptoms',
    description: 'Patient reported seasonal allergy symptoms including itchy eyes and congestion.',
    symptoms: ['Itchy eyes', 'Nasal congestion', 'Sneezing'],
    recommendation: 'Try over-the-counter antihistamines and avoid known allergens when possible.',
    severity: 'low',
    status: 'pending'
  }
];

const Dashboard = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [summaries, setSummaries] = useState<MedicalSummary[]>(mockSummaries);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
    });
  };

  const handleMintNFT = (summaryId: string) => {
    if (!walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Aptos wallet to mint NFTs.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock NFT minting process - in real app, this would interact with Aptos blockchain
    setSummaries(prev => 
      prev.map(summary => 
        summary.id === summaryId ? { ...summary, status: 'minted' } : summary
      )
    );
    
    toast({
      title: "NFT Successfully Minted",
      description: "Your medical summary has been securely stored on the Aptos blockchain.",
      action: (
        <Button size="sm" variant="outline">
          View
        </Button>
      ),
    });
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    summary.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-dark mb-2">Your Health Records</h1>
            <p className="text-gray-600">
              Manage and secure your medical summaries as NFTs on the Aptos blockchain
            </p>
          </div>
          
          {walletConnected ? (
            <div className="flex items-center space-x-2 bg-medical-secondary px-4 py-2 rounded-lg">
              <Shield className="h-4 w-4 text-medical-primary" />
              <span className="text-sm font-medium text-medical-primary">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
          ) : (
            <WalletConnect onConnect={handleWalletConnect} />
          )}
        </div>
        
        {!walletConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">Wallet connection required</h3>
              <p className="text-sm text-yellow-700">
                Connect your Aptos wallet to mint and secure your medical records as NFTs.
              </p>
            </div>
          </div>
        )}
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or symptom..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')} className="gap-2">
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        
        {filteredSummaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No medical records found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term or clear filters' : 'You have no medical summaries yet'}
            </p>
            {!searchQuery && (
              <Button asChild className="bg-medical-primary hover:bg-medical-primary/90">
                <Link to="/chat">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Start Symptom Check
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSummaries.map((summary) => (
              <SummaryCard 
                key={summary.id} 
                summary={summary} 
                onMintNFT={handleMintNFT}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

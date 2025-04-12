
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Predefined wallet credentials
const WALLET_ADDRESS = '0xc44428675a04509cea912d79a922da889328c739da67274abc7974d68c21de96';

export type MedicalSummary = {
  id: string;
  date: string;
  title: string;
  description: string;
  symptoms: string[];
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  status: 'minted' | 'pending';
};

type SummaryCardProps = {
  summary: MedicalSummary;
  onMintNFT: (summaryId: string) => void;
};

const SummaryCard = ({ summary, onMintNFT }: SummaryCardProps) => {
  const [showNFTData, setShowNFTData] = useState(false);
  const { toast } = useToast();
  
  const severityColor = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleDownload = () => {
    // Create a JSON representation of the NFT data
    const nftData = {
      metadata: {
        title: summary.title,
        date: summary.date,
        id: summary.id,
        tokenId: `APT-MED-${summary.id}`,
        blockchain: 'Aptos',
        timestamp: new Date().toISOString(),
        walletAddress: WALLET_ADDRESS,
      },
      content: {
        description: summary.description,
        symptoms: summary.symptoms,
        recommendation: summary.recommendation,
        severity: summary.severity,
      }
    };

    // Convert to a JSON string
    const jsonString = JSON.stringify(nftData, null, 2);
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-nft-${summary.id}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "NFT Downloaded",
      description: `Your medical NFT data has been downloaded as JSON`,
    });
  };

  const handleViewNFT = () => {
    setShowNFTData(true);
  };

  return (
    <>
      <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{summary.title}</CardTitle>
              <CardDescription>{summary.date}</CardDescription>
            </div>
            <Badge className={severityColor[summary.severity]}>
              {summary.severity.charAt(0).toUpperCase() + summary.severity.slice(1)} Severity
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{summary.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Reported Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {summary.symptoms.map((symptom, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Recommendation:</h4>
            <p className="text-sm border-l-2 border-medical-primary pl-3 py-1">{summary.recommendation}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-medical-primary mr-1" />
            <span className="text-xs text-gray-500">Secured with Aptos</span>
          </div>
          
          {summary.status === 'minted' ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleViewNFT}
              >
                <FileText className="h-4 w-4" />
                View NFT
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              className="bg-medical-accent hover:bg-medical-accent/90 gap-1"
              onClick={() => onMintNFT(summary.id)}
            >
              <CheckCircle className="h-4 w-4" />
              Mint NFT
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showNFTData} onOpenChange={setShowNFTData}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-medical-primary" />
              NFT Data: {summary.title}
            </DialogTitle>
            <DialogDescription>
              Secure medical data stored on the Aptos blockchain
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border text-sm font-mono">
              <h3 className="text-xs font-semibold text-gray-500 mb-2">NFT METADATA</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">Token ID:</span>
                <span>APT-MED-{summary.id}</span>
                <span className="text-gray-500">Date:</span>
                <span>{summary.date}</span>
                <span className="text-gray-500">Blockchain:</span>
                <span>Aptos</span>
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium">Verified</span>
                <span className="text-gray-500">Wallet Address:</span>
                <span className="text-xs break-all">{WALLET_ADDRESS.substring(0, 18)}...</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Medical Contents</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs text-gray-500">DESCRIPTION</h4>
                  <p className="text-sm">{summary.description}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">SYMPTOMS</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {summary.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">RECOMMENDATION</h4>
                  <p className="text-sm border-l-2 border-medical-primary pl-3 py-1 mt-1">
                    {summary.recommendation}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">SEVERITY</h4>
                  <Badge className={severityColor[summary.severity]}>
                    {summary.severity.charAt(0).toUpperCase() + summary.severity.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={handleDownload} size="sm" className="gap-1 bg-medical-primary hover:bg-medical-primary/90">
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SummaryCard;

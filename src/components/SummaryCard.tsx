
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Download } from 'lucide-react';

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
  const severityColor = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
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
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
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
  );
};

export default SummaryCard;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, FileSpreadsheet, Building2, TrendingUp, Users, MapPin } from 'lucide-react';
import { 
  generateSampleLoanTapes, 
  downloadSampleTape, 
  downloadAllSampleTapes,
  NBFC_PROFILES,
  type NBFCProfile 
} from '../utils/sample-data-generator';

const SampleDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTapes, setGeneratedTapes] = useState<{ [key: string]: Blob[] } | null>(null);

  const handleGenerateSamples = async () => {
    setIsGenerating(true);
    try {
      // Simulate generation time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tapes = generateSampleLoanTapes();
      setGeneratedTapes(tapes);
    } catch (error) {
      console.error('Error generating sample tapes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    if (generatedTapes) {
      downloadAllSampleTapes();
    }
  };

  const handleDownloadBucket = (bucketKey: string) => {
    if (generatedTapes && generatedTapes[bucketKey]) {
      generatedTapes[bucketKey].forEach((blob, index) => {
        setTimeout(() => {
          downloadSampleTape(blob, (blob as any).filename);
        }, index * 300);
      });
    }
  };

  const handleDownloadSingle = (bucketKey: string, index: number) => {
    if (generatedTapes && generatedTapes[bucketKey] && generatedTapes[bucketKey][index]) {
      const blob = generatedTapes[bucketKey][index];
      downloadSampleTape(blob, (blob as any).filename);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(0)} Cr`;
  };

  const ProfileCard: React.FC<{ bucketKey: string; profile: NBFCProfile }> = ({ bucketKey, profile }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{profile.aumBucket}</CardTitle>
          <Badge variant={profile.riskProfile === 'Conservative' ? 'default' : 
                         profile.riskProfile === 'Moderate' ? 'secondary' : 'destructive'}>
            {profile.riskProfile}
          </Badge>
        </div>
        <CardDescription>{profile.aumRange}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium">Portfolio Value</p>
              <p className="text-muted-foreground">{formatCurrency(profile.portfolioValue)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <div>
              <p className="font-medium">Total Loans</p>
              <p className="text-muted-foreground">{profile.totalLoans.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            <div>
              <p className="font-medium">Avg Loan Size</p>
              <p className="text-muted-foreground">₹{(profile.avgLoanSize / 100000).toFixed(1)}L</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <div>
              <p className="font-medium">Geography</p>
              <p className="text-muted-foreground">
                {profile.geographicFocus.length > 3 ? 'Pan India' : `${profile.geographicFocus.length} states`}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-2">Product Mix</p>
          <div className="space-y-1">
            {Object.entries(profile.productMix).map(([product, percentage]) => (
              <div key={product} className="flex justify-between text-xs">
                <span>{product}</span>
                <span className="font-medium">{(percentage * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {generatedTapes && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sample Files Generated</span>
              <Badge variant="outline">10 files</Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDownloadBucket(bucketKey)}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Download All
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadSingle(bucketKey, i)}
                  className="h-8 text-xs"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            NBFC Sample Loan Tape Generator
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Generate realistic loan tape samples across different AUM buckets for testing and analysis
          </p>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleGenerateSamples}
              disabled={isGenerating}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              {isGenerating ? 'Generating Samples...' : 'Generate Sample Loan Tapes'}
            </Button>
            
            {generatedTapes && (
              <Button 
                onClick={handleDownloadAll}
                variant="outline"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download All (40 files)
              </Button>
            )}
          </div>
        </div>

        {isGenerating && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Generating 40 sample loan tapes across 4 AUM buckets...</p>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">AUM Bucket Overview</TabsTrigger>
            <TabsTrigger value="details">Sample Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(NBFC_PROFILES).map(([bucketKey, profile]) => (
                <ProfileCard key={bucketKey} bucketKey={bucketKey} profile={profile} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Specifications</CardTitle>
                <CardDescription>
                  Each generated loan tape contains comprehensive loan-level data with the following attributes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Loan Identifiers</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Loan ID (Unique)</li>
                      <li>• Borrower Name</li>
                      <li>• PAN Number</li>
                      <li>• Product Type</li>
                      <li>• Loan Type</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Financial Details</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Loan Amount</li>
                      <li>• Interest Rate</li>
                      <li>• Tenure & EMI</li>
                      <li>• Outstanding Principal</li>
                      <li>• Processing Fees</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-600">Risk Metrics</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Credit Scores</li>
                      <li>• LTV & DSCR</li>
                      <li>• Delinquency Status</li>
                      <li>• Risk Rating</li>
                      <li>• Days Past Due</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-600">Demographics</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Borrower Age</li>
                      <li>• Annual Income</li>
                      <li>• Employment Type</li>
                      <li>• State & City</li>
                      <li>• Geographic Distribution</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Operational Data</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Origination Channel</li>
                      <li>• KYC Status</li>
                      <li>• Manual Overrides</li>
                      <li>• Restructuring Flags</li>
                      <li>• First Payment Default</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-indigo-600">Recovery & Collections</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Recovery Amount</li>
                      <li>• Write-off Amount</li>
                      <li>• Collateral Details</li>
                      <li>• Late Payment Fees</li>
                      <li>• Prepayment Status</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Quality & Realism</CardTitle>
                <CardDescription>
                  Our sample data generator creates realistic loan portfolios based on industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Risk-Based Distribution</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• <strong>Conservative NBFCs:</strong> Higher credit scores (720-850), lower delinquency rates</li>
                      <li>• <strong>Moderate NBFCs:</strong> Balanced risk profile (650-750), moderate delinquency</li>
                      <li>• <strong>Aggressive NBFCs:</strong> Lower credit scores (580-720), higher risk tolerance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Geographic Realism</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• <strong>Smaller NBFCs:</strong> Regional focus (3-5 states)</li>
                      <li>• <strong>Medium NBFCs:</strong> Multi-state presence (5-7 states)</li>
                      <li>• <strong>Large NBFCs:</strong> Pan-India operations</li>
                      <li>• City-wise distribution within states</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Product Mix Variation</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• Personal loans dominate smaller NBFCs</li>
                      <li>• Business loans increase with NBFC size</li>
                      <li>• Home loans appear in medium+ NBFCs</li>
                      <li>• Corporate loans only in largest NBFCs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Forensic Red Flags</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• 3-5% First Payment Defaults</li>
                      <li>• 5-8% Manual overrides</li>
                      <li>• 8-12% Restructured loans</li>
                      <li>• Realistic delinquency patterns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SampleDataGenerator;
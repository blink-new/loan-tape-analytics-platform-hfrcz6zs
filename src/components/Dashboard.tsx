import { useState } from 'react'
import { ArrowLeft, Download, FileText, AlertTriangle, TrendingUp, Users, DollarSign, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { AnalysisResult } from '../types/loan-tape'
import { generateWordReport, ReportOptions } from '../utils/report-generator'
import ReportGenerator from './ReportGenerator'
import AnalyticsCharts from './AnalyticsCharts'

interface DashboardProps {
  onNavigateToLanding: () => void
  analyses: AnalysisResult[]
  setAnalyses: (analyses: AnalysisResult[]) => void
}

export default function Dashboard({ onNavigateToLanding, analyses, setAnalyses }: DashboardProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(
    analyses.length > 0 ? analyses[0] : null
  )
  const [showReportGenerator, setShowReportGenerator] = useState(false)

  if (!selectedAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Analysis Available</h2>
          <p className="text-slate-600 mb-6">Upload loan tape files to start analyzing</p>
          <Button onClick={onNavigateToLanding}>
            Upload Files
          </Button>
        </div>
      </div>
    )
  }

  const handleGenerateReport = async (options: ReportOptions) => {
    try {
      await generateWordReport(selectedAnalysis, options)
      setShowReportGenerator(false)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onNavigateToLanding}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-sm text-slate-600">
                  Analysis of {selectedAnalysis.fileName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setShowReportGenerator(true)}
                className="bg-blue-700 hover:bg-blue-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis Selector */}
        {analyses.length > 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id}
                  className={`cursor-pointer transition-all ${
                    selectedAnalysis.id === analysis.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{analysis.fileName}</CardTitle>
                    <CardDescription>
                      {analysis.totalLoans.toLocaleString()} loans • ${(analysis.totalAmount / 1000000).toFixed(1)}M
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedAnalysis.totalLoans.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg Size: ${selectedAnalysis.avgLoanSize.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(selectedAnalysis.totalAmount / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Total outstanding amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delinquency Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedAnalysis.performanceMetrics.currentDelinquencyRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current portfolio delinquency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Red Flags</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {selectedAnalysis.forensicFlags.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Forensic issues detected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="forensic">Forensic Flags</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Quality */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Quality Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Credit Score</span>
                    <span className="font-semibold">{selectedAnalysis.creditQuality.avgCreditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average DSCR</span>
                    <span className="font-semibold">{selectedAnalysis.creditQuality.avgDscr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average LTV</span>
                    <span className="font-semibold">{selectedAnalysis.creditQuality.avgLtv}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Underwriting Quality</span>
                    <Badge variant="secondary">{selectedAnalysis.creditQuality.underwritingQuality}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Yield Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Yield & Profitability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Contractual Yield</span>
                    <span className="font-semibold">{selectedAnalysis.yieldMetrics.avgContractualYield.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Yield</span>
                    <span className="font-semibold">{selectedAnalysis.yieldMetrics.effectiveYield.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Interest Margin</span>
                    <span className="font-semibold">{selectedAnalysis.yieldMetrics.netInterestMargin.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost to Income Ratio</span>
                    <span className="font-semibold">{selectedAnalysis.yieldMetrics.costToIncomeRatio.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Cumulative Default Rate</span>
                    <span className="font-semibold">{selectedAnalysis.performanceMetrics.cumulativeDefaultRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Loss Rate</span>
                    <span className="font-semibold">{selectedAnalysis.performanceMetrics.netLossRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recovery Rate</span>
                    <span className="font-semibold">{selectedAnalysis.performanceMetrics.recoveryRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prepayment Rate</span>
                    <span className="font-semibold">{selectedAnalysis.performanceMetrics.prepaymentRate.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Concentration Risk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Top 10 Borrowers</span>
                    <span className="font-semibold">{selectedAnalysis.concentrationRisk.top10BorrowersShare.toFixed(2)}%</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Geography Distribution</span>
                    {Object.entries(selectedAnalysis.concentrationRisk.geographyConcentration).slice(0, 3).map(([geo, pct]) => (
                      <div key={geo} className="flex justify-between text-sm">
                        <span>{geo}</span>
                        <span>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Macro & Stress Testing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average PD</span>
                    <span className="font-semibold">{selectedAnalysis.macroMetrics.avgPd.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average LGD</span>
                    <span className="font-semibold">{selectedAnalysis.macroMetrics.avgLgd}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Credit Loss</span>
                    <span className="font-semibold">{selectedAnalysis.macroMetrics.expectedCreditLoss.toFixed(2)}%</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Stress Test Results</span>
                    {Object.entries(selectedAnalysis.macroMetrics.stressTestResults).map(([scenario, result]) => (
                      <div key={scenario} className="flex justify-between text-sm">
                        <span>{scenario}</span>
                        <span>{result.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>KYC Completion Rate</span>
                    <span className="font-semibold">{selectedAnalysis.complianceMetrics.kycCompletionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manual Override Rate</span>
                    <span className="font-semibold">{selectedAnalysis.complianceMetrics.manualOverrideRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Payment Default</span>
                    <span className="font-semibold">{selectedAnalysis.complianceMetrics.fpd.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Underwriting TAT</span>
                    <span className="font-semibold">{selectedAnalysis.complianceMetrics.avgUnderwritingTat.toFixed(1)} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forensic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Forensic Red Flags
                </CardTitle>
                <CardDescription>
                  Critical issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAnalysis.forensicFlags.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Red Flags Detected</h3>
                    <p className="text-slate-600">The portfolio appears to be clean with no major forensic issues.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedAnalysis.forensicFlags.map((flag) => (
                      <div key={flag.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {flag.type.replace('_', ' ').toUpperCase()}
                              </h4>
                              <Badge className={getSeverityColor(flag.severity)}>
                                {flag.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm text-slate-600">
                            <div>Affected: {flag.affectedLoans} loans</div>
                            <div>Risk: ${flag.riskAmount.toLocaleString()}</div>
                          </div>
                        </div>
                        <p className="text-slate-700 mb-3">{flag.description}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <h5 className="font-medium text-blue-900 mb-1">Recommendation:</h5>
                          <p className="text-blue-800 text-sm">{flag.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <AnalyticsCharts analysis={selectedAnalysis} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Generator Modal */}
      {showReportGenerator && (
        <ReportGenerator
          analysis={selectedAnalysis}
          onGenerate={handleGenerateReport}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
    </div>
  )
}
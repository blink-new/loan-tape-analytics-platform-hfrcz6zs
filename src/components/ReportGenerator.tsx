import { useState } from 'react'
import { X, FileText, Download, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { AnalysisResult } from '../types/loan-tape'
import { ReportOptions } from '../utils/report-generator'

interface ReportGeneratorProps {
  analysis: AnalysisResult
  onGenerate: (options: ReportOptions) => void
  onClose: () => void
}

export default function ReportGenerator({ analysis, onGenerate, onClose }: ReportGeneratorProps) {
  const [options, setOptions] = useState<ReportOptions>({
    includeExecutiveSummary: true,
    includeDetailedAnalysis: true,
    includeForensicFindings: true,
    includeRecommendations: true,
    companyName: '',
    reportDate: new Date().toISOString().split('T')[0]
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate(options)
    } finally {
      setIsGenerating(false)
    }
  }

  const reportTemplates = [
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview for senior management and investors',
      sections: ['Executive Summary', 'Key Metrics', 'Critical Findings', 'Recommendations']
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive report with all analytics categories',
      sections: ['Executive Summary', 'Detailed Analysis', 'Performance Metrics', 'Risk Assessment', 'Forensic Findings', 'Recommendations']
    },
    {
      id: 'forensic',
      name: 'Forensic Focus',
      description: 'Specialized report focusing on red flags and compliance issues',
      sections: ['Executive Summary', 'Forensic Findings', 'Compliance Analysis', 'Risk Mitigation', 'Recommendations']
    }
  ]

  const selectTemplate = (templateId: string) => {
    switch (templateId) {
      case 'executive':
        setOptions({
          ...options,
          includeExecutiveSummary: true,
          includeDetailedAnalysis: false,
          includeForensicFindings: true,
          includeRecommendations: true
        })
        break
      case 'detailed':
        setOptions({
          ...options,
          includeExecutiveSummary: true,
          includeDetailedAnalysis: true,
          includeForensicFindings: true,
          includeRecommendations: true
        })
        break
      case 'forensic':
        setOptions({
          ...options,
          includeExecutiveSummary: true,
          includeDetailedAnalysis: false,
          includeForensicFindings: true,
          includeRecommendations: true
        })
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Generate Word Report</h2>
              <p className="text-sm text-slate-600">Create professional analysis report for {analysis.fileName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Report Templates */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Report Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                  onClick={() => selectTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {template.sections.map((section, index) => (
                        <div key={index} className="text-xs text-slate-600 flex items-center">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mr-2"></div>
                          {section}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Options */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Customize Report</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Sections */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Include Sections</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="executive-summary"
                      checked={options.includeExecutiveSummary}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, includeExecutiveSummary: checked as boolean })
                      }
                    />
                    <Label htmlFor="executive-summary" className="text-sm">
                      Executive Summary
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="detailed-analysis"
                      checked={options.includeDetailedAnalysis}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, includeDetailedAnalysis: checked as boolean })
                      }
                    />
                    <Label htmlFor="detailed-analysis" className="text-sm">
                      Detailed Analysis
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="forensic-findings"
                      checked={options.includeForensicFindings}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, includeForensicFindings: checked as boolean })
                      }
                    />
                    <Label htmlFor="forensic-findings" className="text-sm">
                      Forensic Findings & Red Flags
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommendations"
                      checked={options.includeRecommendations}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, includeRecommendations: checked as boolean })
                      }
                    />
                    <Label htmlFor="recommendations" className="text-sm">
                      Recommendations
                    </Label>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Report Details</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name" className="text-sm">
                      Company Name (Optional)
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="Your Financial Institution"
                      value={options.companyName}
                      onChange={(e) => setOptions({ ...options, companyName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="report-date" className="text-sm">
                      Report Date
                    </Label>
                    <Input
                      id="report-date"
                      type="date"
                      value={options.reportDate}
                      onChange={(e) => setOptions({ ...options, reportDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Preview */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Preview</h3>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Report will include:</div>
                  <ul className="space-y-1 text-slate-600">
                    {options.includeExecutiveSummary && (
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        Executive Summary with key metrics table
                      </li>
                    )}
                    {options.includeDetailedAnalysis && (
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        Detailed analysis across all 7 categories
                      </li>
                    )}
                    {options.includeForensicFindings && analysis.forensicFlags.length > 0 && (
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                        {analysis.forensicFlags.length} forensic red flags with severity analysis
                      </li>
                    )}
                    {options.includeRecommendations && (
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                        Actionable recommendations based on findings
                      </li>
                    )}
                  </ul>
                  <div className="pt-2 text-xs text-slate-500">
                    Estimated pages: {
                      (options.includeExecutiveSummary ? 2 : 0) +
                      (options.includeDetailedAnalysis ? 4 : 0) +
                      (options.includeForensicFindings && analysis.forensicFlags.length > 0 ? 2 : 0) +
                      (options.includeRecommendations ? 1 : 0)
                    } pages
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-slate-50">
          <div className="text-sm text-slate-600">
            Report will be downloaded as a Word document (.docx)
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-700 hover:bg-blue-800"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
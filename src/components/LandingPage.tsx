import { useState } from 'react'
import { Upload, FileText, BarChart3, Shield, TrendingUp, AlertTriangle, FileCheck, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AnalysisResult } from '../types/loan-tape'
import { generateMockAnalysis } from '../utils/mock-data'

interface LandingPageProps {
  onNavigateToDashboard: () => void
  onNavigateToSamples: () => void
  analyses: AnalysisResult[]
  setAnalyses: (analyses: AnalysisResult[]) => void
}

export default function LandingPage({ onNavigateToDashboard, onNavigateToSamples, analyses, setAnalyses }: LandingPageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    // Simulate file processing
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      const mockAnalysis = generateMockAnalysis(file.name)
      setAnalyses([...analyses, mockAnalysis])
    }
    
    setIsUploading(false)
    onNavigateToDashboard()
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const features = [
    {
      icon: FileText,
      title: "Multi-Format Processing",
      description: "Upload and analyze Excel, PDF, and image files with automated data extraction"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "7 core analytics categories covering 50+ metrics for complete portfolio assessment"
    },
    {
      icon: Shield,
      title: "Forensic Red Flags",
      description: "Advanced fraud detection and risk identification based on industry best practices"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Vintage analysis, roll rates, and predictive modeling for portfolio performance"
    },
    {
      icon: FileCheck,
      title: "Compliance Validation",
      description: "Regulatory compliance checks against IFRS 9, Basel III, and industry standards"
    },
    {
      icon: Download,
      title: "Professional Reports",
      description: "One-click Word document generation with executive summaries and detailed findings"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Loan Tape Analytics</h1>
                <p className="text-sm text-slate-600">Forensic Insights Platform</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={onNavigateToSamples} variant="outline">
                Generate Sample Data
              </Button>
              {analyses.length > 0 && (
                <Button onClick={onNavigateToDashboard} variant="outline">
                  View Dashboard ({analyses.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Professional Loan Tape Analytics & 
            <span className="text-blue-700"> Forensic Insights</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Upload, analyze, and extract deep insights from loan tape files. Generate comprehensive 
            risk assessments, performance metrics, and investor-ready reports with forensic red flag detection.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
              <div
                className={`text-center ${dragActive ? 'bg-blue-50 border-blue-300' : ''} rounded-lg p-8 transition-colors`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Upload Loan Tape Files
                </h3>
                <p className="text-slate-600 mb-6">
                  Drag and drop your files here, or click to browse
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Supports Excel (.xlsx, .xls), PDF, and image files (PNG, JPG)
                </p>
                
                <div className="space-y-3">
                  <label htmlFor="file-upload">
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        {isUploading ? 'Processing...' : 'Select Files'}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-700 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">Analyzing loan tape data...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-700" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Categories */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Comprehensive Analytics Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Loan-Level Data", metrics: "12+ metrics", color: "bg-blue-100 text-blue-700" },
              { title: "Credit Quality", metrics: "7+ metrics", color: "bg-green-100 text-green-700" },
              { title: "Performance Analysis", metrics: "8+ metrics", color: "bg-amber-100 text-amber-700" },
              { title: "Yield & Profitability", metrics: "6+ metrics", color: "bg-purple-100 text-purple-700" },
              { title: "Compliance & Operations", metrics: "8+ metrics", color: "bg-red-100 text-red-700" },
              { title: "Macro & Stress Testing", metrics: "5+ metrics", color: "bg-indigo-100 text-indigo-700" },
              { title: "Concentration Risk", metrics: "5+ metrics", color: "bg-pink-100 text-pink-700" },
              { title: "Forensic Red Flags", metrics: "6+ flags", color: "bg-orange-100 text-orange-700" }
            ].map((category, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{category.title}</h4>
                <p className="text-sm text-slate-600">{category.metrics}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            Built for financial institutions, investors, and due diligence professionals
          </p>
        </div>
      </footer>
    </div>
  )
}
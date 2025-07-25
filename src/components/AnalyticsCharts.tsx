import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AnalysisResult } from '../types/loan-tape'

interface AnalyticsChartsProps {
  analysis: AnalysisResult
}

const COLORS = ['#1e40af', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16']

export default function AnalyticsCharts({ analysis }: AnalyticsChartsProps) {
  // Prepare data for charts
  const loanTypeData = Object.entries(analysis.portfolioMetrics.loanTypeDistribution).map(([type, percentage]) => ({
    name: type,
    value: percentage,
    amount: (analysis.totalAmount * percentage / 100)
  }))

  const channelData = Object.entries(analysis.portfolioMetrics.channelDistribution).map(([channel, percentage]) => ({
    name: channel,
    value: percentage
  }))

  const geographyData = Object.entries(analysis.portfolioMetrics.geographyDistribution).map(([geo, percentage]) => ({
    name: geo,
    value: percentage
  }))

  const creditScoreData = Object.entries(analysis.creditQuality.creditScoreDistribution).map(([range, percentage]) => ({
    range,
    percentage,
    count: Math.floor(analysis.totalLoans * percentage / 100)
  }))

  const dpdData = Object.entries(analysis.performanceMetrics.dpdDistribution).map(([bucket, percentage]) => ({
    bucket: bucket === '0' ? 'Current' : `${bucket} DPD`,
    percentage,
    loans: Math.floor(analysis.totalLoans * percentage / 100)
  }))

  const vintageData = Object.entries(analysis.performanceMetrics.vintageAnalysis).map(([year, defaultRate]) => ({
    year,
    defaultRate,
    name: `Vintage ${year}`
  }))

  const stressTestData = Object.entries(analysis.macroMetrics.stressTestResults).map(([scenario, rate]) => ({
    scenario,
    rate,
    impact: rate - analysis.performanceMetrics.cumulativeDefaultRate
  }))

  return (
    <div className="space-y-6">
      {/* Portfolio Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Type Distribution</CardTitle>
            <CardDescription>Portfolio composition by loan type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origination Channel Mix</CardTitle>
            <CardDescription>Distribution by origination channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="value" fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Credit Quality Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Score Distribution</CardTitle>
            <CardDescription>Borrower credit score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={creditScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'percentage' ? `${value}%` : value.toLocaleString(),
                    name === 'percentage' ? 'Percentage' : 'Loan Count'
                  ]} 
                />
                <Bar dataKey="percentage" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delinquency Status</CardTitle>
            <CardDescription>Current portfolio delinquency buckets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dpdData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="percentage" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vintage Analysis</CardTitle>
            <CardDescription>Default rates by origination year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vintageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Default Rate']} />
                <Line type="monotone" dataKey="defaultRate" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress Test Results</CardTitle>
            <CardDescription>Default rates under different scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stressTestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Default Rate']} />
                <Bar dataKey="rate" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Portfolio concentration by geography</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={geographyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">
              {analysis.yieldMetrics.effectiveYield.toFixed(2)}%
            </div>
            <p className="text-sm text-slate-600">Effective Yield</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-700">
              {analysis.performanceMetrics.recoveryRate.toFixed(2)}%
            </div>
            <p className="text-sm text-slate-600">Recovery Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-700">
              {analysis.macroMetrics.expectedCreditLoss.toFixed(2)}%
            </div>
            <p className="text-sm text-slate-600">Expected Credit Loss</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-700">
              {analysis.concentrationRisk.top10BorrowersShare.toFixed(1)}%
            </div>
            <p className="text-sm text-slate-600">Top 10 Concentration</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
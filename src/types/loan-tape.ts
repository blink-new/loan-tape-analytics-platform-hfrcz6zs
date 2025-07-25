export interface LoanData {
  id: string
  loanId: string
  originationDate: string
  maturityDate: string
  loanType: string
  productType: string
  originationChannel: string
  interestRate: number
  emiAmount: number
  repaymentFrequency: string
  collateralType?: string
  collateralValue?: number
  borrowerAge: number
  borrowerIncome: number
  borrowerGeography: string
  loanStatus: string
  creditScore: number
  currentCreditScore?: number
  dscr?: number
  ltv?: number
  riskRating: string
  delinquencyStatus: string
  dpd: number
  principalOutstanding: number
  interestOutstanding: number
  totalOutstanding: number
  userId: string
  createdAt: string
}

export interface AnalysisResult {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  totalLoans: number
  totalAmount: number
  avgLoanSize: number
  portfolioMetrics: PortfolioMetrics
  creditQuality: CreditQuality
  performanceMetrics: PerformanceMetrics
  yieldMetrics: YieldMetrics
  complianceMetrics: ComplianceMetrics
  macroMetrics: MacroMetrics
  concentrationRisk: ConcentrationRisk
  forensicFlags: ForensicFlag[]
  userId: string
  createdAt: string
}

export interface PortfolioMetrics {
  totalLoans: number
  totalAmount: number
  avgLoanSize: number
  medianLoanSize: number
  avgTenure: number
  loanTypeDistribution: Record<string, number>
  channelDistribution: Record<string, number>
  geographyDistribution: Record<string, number>
}

export interface CreditQuality {
  avgCreditScore: number
  creditScoreDistribution: Record<string, number>
  avgDscr: number
  avgLtv: number
  riskRatingDistribution: Record<string, number>
  underwritingQuality: string
}

export interface PerformanceMetrics {
  currentDelinquencyRate: number
  dpdDistribution: Record<string, number>
  rollRates: Record<string, number>
  cumulativeDefaultRate: number
  netLossRate: number
  prepaymentRate: number
  recoveryRate: number
  vintageAnalysis: Record<string, number>
}

export interface YieldMetrics {
  avgContractualYield: number
  effectiveYield: number
  netInterestMargin: number
  feeIncome: number
  costToIncomeRatio: number
}

export interface ComplianceMetrics {
  kycCompletionRate: number
  avgUnderwritingTat: number
  manualOverrideRate: number
  restructuringRate: number
  fpd: number
}

export interface MacroMetrics {
  avgPd: number
  avgLgd: number
  expectedCreditLoss: number
  stressTestResults: Record<string, number>
  interestRateSensitivity: number
}

export interface ConcentrationRisk {
  top10BorrowersShare: number
  industryConcentration: Record<string, number>
  geographyConcentration: Record<string, number>
  channelConcentration: Record<string, number>
  vintageConcentration: Record<string, number>
}

export interface ForensicFlag {
  id: string
  type: 'zero_emi' | 'backdated_disbursal' | 'evergreening' | 'round_tripping' | 'high_fpd' | 'manual_override'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedLoans: number
  riskAmount: number
  recommendation: string
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: string[]
}

export interface ReportData {
  id: string
  analysisId: string
  templateId: string
  title: string
  executiveSummary: string
  keyFindings: string[]
  recommendations: string[]
  riskAssessment: string
  complianceStatus: string
  generatedAt: string
  userId: string
}
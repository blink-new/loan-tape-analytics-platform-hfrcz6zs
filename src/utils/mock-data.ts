import { AnalysisResult, ForensicFlag } from '../types/loan-tape'

export const generateMockAnalysis = (fileName: string): AnalysisResult => {
  const totalLoans = Math.floor(Math.random() * 10000) + 5000
  const avgLoanSize = Math.floor(Math.random() * 50000) + 25000
  const totalAmount = totalLoans * avgLoanSize

  const forensicFlags: ForensicFlag[] = [
    {
      id: '1',
      type: 'high_fpd',
      severity: 'high',
      description: 'First Payment Default rate exceeds industry benchmarks',
      affectedLoans: Math.floor(totalLoans * 0.03),
      riskAmount: Math.floor(totalAmount * 0.02),
      recommendation: 'Review underwriting criteria and borrower verification processes'
    },
    {
      id: '2',
      type: 'manual_override',
      severity: 'medium',
      description: 'High frequency of manual underwriting overrides detected',
      affectedLoans: Math.floor(totalLoans * 0.05),
      riskAmount: Math.floor(totalAmount * 0.03),
      recommendation: 'Implement stricter approval workflows and documentation requirements'
    }
  ]

  return {
    id: `analysis_${Date.now()}`,
    fileName,
    fileType: fileName.split('.').pop() || 'unknown',
    uploadDate: new Date().toISOString(),
    totalLoans,
    totalAmount,
    avgLoanSize,
    portfolioMetrics: {
      totalLoans,
      totalAmount,
      avgLoanSize,
      medianLoanSize: avgLoanSize * 0.85,
      avgTenure: 36,
      loanTypeDistribution: {
        'Personal Loan': 45,
        'Auto Loan': 25,
        'Home Loan': 20,
        'Business Loan': 10
      },
      channelDistribution: {
        'Digital': 60,
        'Branch': 25,
        'DSA': 15
      },
      geographyDistribution: {
        'Mumbai': 25,
        'Delhi': 20,
        'Bangalore': 18,
        'Chennai': 15,
        'Others': 22
      }
    },
    creditQuality: {
      avgCreditScore: 720,
      creditScoreDistribution: {
        '750+': 35,
        '700-749': 30,
        '650-699': 25,
        '<650': 10
      },
      avgDscr: 1.45,
      avgLtv: 75,
      riskRatingDistribution: {
        'Low': 40,
        'Medium': 35,
        'High': 20,
        'Very High': 5
      },
      underwritingQuality: 'Good'
    },
    performanceMetrics: {
      currentDelinquencyRate: 3.2,
      dpdDistribution: {
        '0': 85,
        '1-30': 8,
        '31-60': 4,
        '61-90': 2,
        '90+': 1
      },
      rollRates: {
        '30to60': 25,
        '60to90': 35,
        '90toLoss': 45
      },
      cumulativeDefaultRate: 2.8,
      netLossRate: 1.9,
      prepaymentRate: 12.5,
      recoveryRate: 32,
      vintageAnalysis: {
        '2024': 1.2,
        '2023': 2.8,
        '2022': 3.5,
        '2021': 4.1
      }
    },
    yieldMetrics: {
      avgContractualYield: 14.5,
      effectiveYield: 13.8,
      netInterestMargin: 8.2,
      feeIncome: 2.1,
      costToIncomeRatio: 45
    },
    complianceMetrics: {
      kycCompletionRate: 98.5,
      avgUnderwritingTat: 2.3,
      manualOverrideRate: 5.2,
      restructuringRate: 1.8,
      fpd: 2.1
    },
    macroMetrics: {
      avgPd: 3.2,
      avgLgd: 65,
      expectedCreditLoss: 2.08,
      stressTestResults: {
        'Base Case': 2.8,
        'Adverse': 4.2,
        'Severely Adverse': 6.8
      },
      interestRateSensitivity: 0.15
    },
    concentrationRisk: {
      top10BorrowersShare: 12.5,
      industryConcentration: {
        'IT Services': 25,
        'Manufacturing': 20,
        'Retail': 18,
        'Healthcare': 15,
        'Others': 22
      },
      geographyConcentration: {
        'Maharashtra': 28,
        'Karnataka': 22,
        'Tamil Nadu': 18,
        'Delhi NCR': 20,
        'Others': 12
      },
      channelConcentration: {
        'Direct': 65,
        'Partner 1': 20,
        'Partner 2': 15
      },
      vintageConcentration: {
        '2024': 35,
        '2023': 30,
        '2022': 20,
        '2021': 15
      }
    },
    forensicFlags,
    userId: 'user123',
    createdAt: new Date().toISOString()
  }
}
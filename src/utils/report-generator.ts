import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx'
import { saveAs } from 'file-saver'
import { AnalysisResult, ForensicFlag } from '../types/loan-tape'

export interface ReportOptions {
  includeExecutiveSummary: boolean
  includeDetailedAnalysis: boolean
  includeForensicFindings: boolean
  includeRecommendations: boolean
  companyName?: string
  reportDate?: string
}

const getRecommendations = (analysis: AnalysisResult): string[] => {
  const recommendations: string[] = []

  // Credit quality recommendations
  if (analysis.creditQuality.avgCreditScore < 650) {
    recommendations.push("Consider tightening credit score requirements to improve portfolio quality")
  }

  // Performance recommendations
  if (analysis.performanceMetrics.currentDelinquencyRate > 5) {
    recommendations.push("Implement enhanced collection strategies to reduce delinquency rates")
  }

  // Concentration risk recommendations
  if (analysis.concentrationRisk.top10BorrowersShare > 20) {
    recommendations.push("Diversify borrower base to reduce concentration risk")
  }

  // Forensic recommendations
  if (analysis.forensicFlags.some(flag => flag.severity === 'critical')) {
    recommendations.push("Immediately investigate critical forensic flags and implement corrective measures")
  }

  // Yield recommendations
  if (analysis.yieldMetrics.netInterestMargin < 3) {
    recommendations.push("Review pricing strategy to improve net interest margins")
  }

  // Compliance recommendations
  if (analysis.complianceMetrics.kycCompletionRate < 95) {
    recommendations.push("Strengthen KYC processes to ensure regulatory compliance")
  }

  // Default recommendations if none specific
  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring portfolio performance and maintain current risk management practices")
    recommendations.push("Consider implementing stress testing scenarios for better risk assessment")
    recommendations.push("Regular review of underwriting criteria based on portfolio performance")
  }

  return recommendations
}

export const generateWordReport = async (
  analysis: AnalysisResult,
  options: ReportOptions = {
    includeExecutiveSummary: true,
    includeDetailedAnalysis: true,
    includeForensicFindings: true,
    includeRecommendations: true
  }
) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title Page
          new Paragraph({
            children: [
              new TextRun({
                text: "LOAN TAPE ANALYTICS REPORT",
                bold: true,
                size: 32,
                color: "1e40af"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Analysis of ${analysis.fileName}`,
                size: 24,
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: options.companyName || "Financial Institution",
                size: 20
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Report Date: ${options.reportDate || new Date().toLocaleDateString()}`,
                size: 16
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),

          // Executive Summary
          ...(options.includeExecutiveSummary ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXECUTIVE SUMMARY",
                  bold: true,
                  size: 24,
                  color: "1e40af"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `This report presents a comprehensive analysis of the loan tape file "${analysis.fileName}" containing ${analysis.totalLoans.toLocaleString()} loans with a total portfolio value of $${(analysis.totalAmount / 1000000).toFixed(1)}M. The analysis covers credit quality, performance metrics, yield analysis, compliance review, and forensic red flag detection.`
                })
              ],
              spacing: { after: 200 }
            }),

            // Key Metrics Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Total Loans" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: analysis.totalLoans.toLocaleString() })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Portfolio Value" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${(analysis.totalAmount / 1000000).toFixed(1)}M` })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Average Loan Size" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${analysis.avgLoanSize.toLocaleString()}` })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Current Delinquency Rate" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${analysis.performanceMetrics.currentDelinquencyRate.toFixed(2)}%` })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Average Credit Score" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: analysis.creditQuality.avgCreditScore.toString() })] })] })
                  ]
                })
              ]
            }),
          ] : []),

          // Detailed Analysis
          ...(options.includeDetailedAnalysis ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "DETAILED ANALYSIS",
                  bold: true,
                  size: 24,
                  color: "1e40af"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            // Credit Quality Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Credit Quality Assessment",
                  bold: true,
                  size: 18,
                  color: "374151"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `The portfolio demonstrates ${analysis.creditQuality.underwritingQuality} underwriting quality with an average credit score of ${analysis.creditQuality.avgCreditScore}. The average Debt Service Coverage Ratio (DSCR) stands at ${analysis.creditQuality.avgDscr.toFixed(2)}, indicating ${analysis.creditQuality.avgDscr > 1.25 ? 'strong' : analysis.creditQuality.avgDscr > 1.0 ? 'adequate' : 'weak'} borrower capacity to service debt obligations.`
                })
              ],
              spacing: { after: 200 }
            }),

            // Performance Metrics Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Performance Metrics",
                  bold: true,
                  size: 18,
                  color: "374151"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Current portfolio delinquency rate is ${analysis.performanceMetrics.currentDelinquencyRate.toFixed(2)}%, with a cumulative default rate of ${analysis.performanceMetrics.cumulativeDefaultRate.toFixed(2)}%. The net loss rate stands at ${analysis.performanceMetrics.netLossRate.toFixed(2)}%, while the recovery rate is ${analysis.performanceMetrics.recoveryRate.toFixed(2)}%. Prepayment rate is ${analysis.performanceMetrics.prepaymentRate.toFixed(2)}%, which ${analysis.performanceMetrics.prepaymentRate > 15 ? 'may impact yield projections' : 'is within acceptable ranges'}.`
                })
              ],
              spacing: { after: 200 }
            }),

            // Yield Analysis Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Yield and Profitability Analysis",
                  bold: true,
                  size: 18,
                  color: "374151"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `The portfolio exhibits an average contractual yield of ${analysis.yieldMetrics.avgContractualYield.toFixed(2)}% with an effective yield of ${analysis.yieldMetrics.effectiveYield.toFixed(2)}%. Net Interest Margin (NIM) is ${analysis.yieldMetrics.netInterestMargin.toFixed(2)}%, and the cost-to-income ratio is ${analysis.yieldMetrics.costToIncomeRatio.toFixed(2)}%. Fee income contributes ${analysis.yieldMetrics.feeIncome.toFixed(2)}% to overall profitability.`
                })
              ],
              spacing: { after: 200 }
            }),

            // Concentration Risk Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Concentration Risk Analysis",
                  bold: true,
                  size: 18,
                  color: "374151"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `The top 10 borrowers represent ${analysis.concentrationRisk.top10BorrowersShare.toFixed(2)}% of the total portfolio, indicating ${analysis.concentrationRisk.top10BorrowersShare > 25 ? 'high concentration risk' : analysis.concentrationRisk.top10BorrowersShare > 15 ? 'moderate concentration risk' : 'well-diversified exposure'}. Geographic and industry diversification metrics suggest ${Object.keys(analysis.concentrationRisk.geographyConcentration).length > 5 ? 'adequate' : 'limited'} diversification across regions.`
                })
              ],
              spacing: { after: 200 }
            })
          ] : []),

          // Forensic Findings
          ...(options.includeForensicFindings && analysis.forensicFlags.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "FORENSIC FINDINGS & RED FLAGS",
                  bold: true,
                  size: 24,
                  color: "dc2626"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `The forensic analysis has identified ${analysis.forensicFlags.length} red flags requiring attention. These findings are categorized by severity and potential impact on portfolio quality.`
                })
              ],
              spacing: { after: 200 }
            }),

            // Forensic Flags Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Flag Type", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Severity", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Affected Loans", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Risk Amount", bold: true })] })] })
                  ]
                }),
                ...analysis.forensicFlags.map(flag => 
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: flag.type.replace('_', ' ').toUpperCase() })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: flag.severity.toUpperCase() })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: flag.affectedLoans.toString() })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${flag.riskAmount.toLocaleString()}` })] })] })
                    ]
                  })
                )
              ]
            })
          ] : []),

          // Recommendations
          ...(options.includeRecommendations ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "RECOMMENDATIONS",
                  bold: true,
                  size: 24,
                  color: "1e40af"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Based on the comprehensive analysis, the following recommendations are provided:"
                })
              ],
              spacing: { after: 200 }
            }),

            // Generate recommendations based on analysis
            ...getRecommendations(analysis).map(rec => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${rec}`,
                    size: 22
                  })
                ],
                spacing: { after: 150 }
              })
            )
          ] : [])
        ]
      }
    ]
  })

  // Generate and download the document
  const blob = await Packer.toBlob(doc)
  const fileName = `Loan_Tape_Analysis_${analysis.fileName.replace(/\.[^/.]+$/, "")}_${new Date().toISOString().split('T')[0]}.docx`
  saveAs(blob, fileName)
}
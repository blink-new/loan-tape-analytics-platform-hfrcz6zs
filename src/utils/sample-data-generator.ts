import * as XLSX from 'xlsx';

export interface NBFCProfile {
  aumBucket: string;
  aumRange: string;
  avgLoanSize: number;
  totalLoans: number;
  portfolioValue: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  geographicFocus: string[];
  productMix: Record<string, number>;
}

export const NBFC_PROFILES: Record<string, NBFCProfile> = {
  'small': {
    aumBucket: 'Less than ₹1,000 Cr',
    aumRange: '₹500-999 Cr',
    avgLoanSize: 250000, // 2.5L average
    totalLoans: 2500,
    portfolioValue: 62500000000, // 625 Cr
    riskProfile: 'Conservative',
    geographicFocus: ['Maharashtra', 'Gujarat', 'Karnataka'],
    productMix: {
      'Personal Loan': 0.4,
      'Business Loan': 0.3,
      'Vehicle Loan': 0.2,
      'Gold Loan': 0.1
    }
  },
  'medium': {
    aumBucket: 'Less than ₹5,000 Cr',
    aumRange: '₹2,000-4,999 Cr',
    avgLoanSize: 450000, // 4.5L average
    totalLoans: 7500,
    portfolioValue: 337500000000, // 3,375 Cr
    riskProfile: 'Moderate',
    geographicFocus: ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Delhi'],
    productMix: {
      'Personal Loan': 0.35,
      'Business Loan': 0.25,
      'Vehicle Loan': 0.15,
      'Home Loan': 0.15,
      'Gold Loan': 0.1
    }
  },
  'large': {
    aumBucket: 'Less than ₹10,000 Cr',
    aumRange: '₹6,000-9,999 Cr',
    avgLoanSize: 650000, // 6.5L average
    totalLoans: 12000,
    portfolioValue: 780000000000, // 7,800 Cr
    riskProfile: 'Moderate',
    geographicFocus: ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Delhi', 'West Bengal', 'Rajasthan'],
    productMix: {
      'Personal Loan': 0.3,
      'Business Loan': 0.25,
      'Vehicle Loan': 0.15,
      'Home Loan': 0.2,
      'Gold Loan': 0.1
    }
  },
  'xlarge': {
    aumBucket: 'Greater than ₹10,000 Cr',
    aumRange: '₹15,000+ Cr',
    avgLoanSize: 1200000, // 12L average
    totalLoans: 20000,
    portfolioValue: 2400000000000, // 24,000 Cr
    riskProfile: 'Aggressive',
    geographicFocus: ['Pan India'],
    productMix: {
      'Personal Loan': 0.25,
      'Business Loan': 0.3,
      'Vehicle Loan': 0.15,
      'Home Loan': 0.2,
      'Corporate Loan': 0.1
    }
  }
};

const STATES = [
  'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Delhi', 'West Bengal', 
  'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Telangana',
  'Kerala', 'Punjab', 'Haryana', 'Odisha', 'Jharkhand', 'Assam', 'Bihar'
];

const CITIES = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Delhi': ['New Delhi', 'Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia']
};

const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business Owner', 'Professional', 'Retired'];
const CHANNELS = ['Digital', 'Branch', 'DSA', 'Telecalling', 'Co-lending', 'Partner'];
const COLLATERAL_TYPES = ['Property', 'Vehicle', 'Gold', 'FD', 'Shares', 'None'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateLoanId(index: number, nbfcCode: string): string {
  return `${nbfcCode}${String(index).padStart(6, '0')}`;
}

function generatePAN(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return Array.from({length: 5}, () => getRandomElement(letters.split(''))).join('') +
         Array.from({length: 4}, () => getRandomElement(numbers.split(''))).join('') +
         getRandomElement(letters.split(''));
}

function generateCreditScore(riskProfile: string): number {
  switch (riskProfile) {
    case 'Conservative': return getRandomNumber(720, 850);
    case 'Moderate': return getRandomNumber(650, 750);
    case 'Aggressive': return getRandomNumber(580, 720);
    default: return getRandomNumber(650, 750);
  }
}

function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12 / 100;
  return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                   (Math.pow(1 + monthlyRate, tenure) - 1));
}

function getDelinquencyStatus(daysPastDue: number): string {
  if (daysPastDue === 0) return 'Current';
  if (daysPastDue <= 30) return '1-30 DPD';
  if (daysPastDue <= 60) return '31-60 DPD';
  if (daysPastDue <= 90) return '61-90 DPD';
  return '90+ DPD';
}

function generateLoanData(profile: NBFCProfile, loanCount: number, nbfcName: string): any[] {
  const loans = [];
  const nbfcCode = nbfcName.substring(0, 3).toUpperCase();
  
  for (let i = 1; i <= loanCount; i++) {
    // Determine product type based on mix
    const rand = Math.random();
    let productType = 'Personal Loan';
    let cumulative = 0;
    
    for (const [product, percentage] of Object.entries(profile.productMix)) {
      cumulative += percentage;
      if (rand <= cumulative) {
        productType = product;
        break;
      }
    }
    
    // Generate loan amount based on product type and NBFC size
    let loanAmount: number;
    switch (productType) {
      case 'Personal Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 0.3, profile.avgLoanSize * 1.5);
        break;
      case 'Business Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 0.8, profile.avgLoanSize * 3);
        break;
      case 'Vehicle Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 0.5, profile.avgLoanSize * 2);
        break;
      case 'Home Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 2, profile.avgLoanSize * 8);
        break;
      case 'Gold Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 0.1, profile.avgLoanSize * 0.8);
        break;
      case 'Corporate Loan':
        loanAmount = getRandomNumber(profile.avgLoanSize * 5, profile.avgLoanSize * 20);
        break;
      default:
        loanAmount = profile.avgLoanSize;
    }
    
    const interestRate = getRandomFloat(8.5, 24.0);
    const tenure = getRandomNumber(12, 84); // 1-7 years
    const emi = calculateEMI(loanAmount, interestRate, tenure);
    
    const originationDate = getRandomDate(new Date('2020-01-01'), new Date('2024-12-31'));
    const maturityDate = new Date(originationDate);
    maturityDate.setMonth(maturityDate.getMonth() + tenure);
    
    // Geographic distribution
    const state = profile.geographicFocus.includes('Pan India') 
      ? getRandomElement(STATES)
      : getRandomElement(profile.geographicFocus);
    const city = CITIES[state] ? getRandomElement(CITIES[state]) : state;
    
    // Risk-based parameters
    const creditScore = generateCreditScore(profile.riskProfile);
    const daysPastDue = Math.random() < 0.85 ? 0 : getRandomNumber(1, 120);
    const loanStatus = daysPastDue > 90 ? 'Default' : daysPastDue > 0 ? 'Delinquent' : 'Active';
    
    // LTV calculation
    const ltv = productType === 'Home Loan' ? getRandomFloat(60, 90) :
                productType === 'Vehicle Loan' ? getRandomFloat(70, 95) :
                productType === 'Gold Loan' ? getRandomFloat(60, 80) : 0;
    
    const loan = {
      'Loan ID': generateLoanId(i, nbfcCode),
      'Borrower Name': `Borrower ${i}`,
      'PAN': generatePAN(),
      'Product Type': productType,
      'Loan Type': productType.includes('Business') || productType.includes('Corporate') ? 'Business' : 'Retail',
      'Loan Amount': loanAmount,
      'Interest Rate (%)': interestRate,
      'Tenure (Months)': tenure,
      'EMI Amount': emi,
      'Origination Date': originationDate.toISOString().split('T')[0],
      'Maturity Date': maturityDate.toISOString().split('T')[0],
      'Loan Status': loanStatus,
      'Delinquency Status': getDelinquencyStatus(daysPastDue),
      'Days Past Due': daysPastDue,
      'Credit Score at Origination': creditScore,
      'Current Credit Score': Math.max(creditScore - getRandomNumber(0, 50), 300),
      'LTV (%)': ltv,
      'DSCR': productType.includes('Business') ? getRandomFloat(1.1, 2.5) : null,
      'Borrower Age': getRandomNumber(21, 65),
      'Annual Income': getRandomNumber(300000, 2000000),
      'Employment Type': getRandomElement(EMPLOYMENT_TYPES),
      'State': state,
      'City': city,
      'Origination Channel': getRandomElement(CHANNELS),
      'Collateral Type': productType === 'Personal Loan' ? 'None' : getRandomElement(COLLATERAL_TYPES),
      'Collateral Value': ltv > 0 ? Math.round(loanAmount / (ltv / 100)) : null,
      'Outstanding Principal': loanStatus === 'Default' ? 0 : Math.round(loanAmount * getRandomFloat(0.3, 0.95)),
      'Total Interest Paid': Math.round(emi * getRandomNumber(1, tenure) * 0.4),
      'Processing Fee': Math.round(loanAmount * getRandomFloat(0.01, 0.03)),
      'Late Payment Fee': daysPastDue > 0 ? getRandomNumber(500, 2000) : 0,
      'Prepayment': Math.random() < 0.15 ? 'Yes' : 'No',
      'Restructured': Math.random() < 0.08 ? 'Yes' : 'No',
      'First Payment Default': Math.random() < 0.03 ? 'Yes' : 'No',
      'KYC Status': Math.random() < 0.98 ? 'Complete' : 'Pending',
      'Manual Override': Math.random() < 0.05 ? 'Yes' : 'No',
      'Risk Rating': profile.riskProfile === 'Conservative' ? getRandomElement(['A', 'B']) :
                     profile.riskProfile === 'Moderate' ? getRandomElement(['B', 'C']) :
                     getRandomElement(['C', 'D']),
      'Recovery Amount': loanStatus === 'Default' ? Math.round(loanAmount * getRandomFloat(0.1, 0.6)) : 0,
      'Write-off Amount': loanStatus === 'Default' ? Math.round(loanAmount * getRandomFloat(0.4, 0.9)) : 0
    };
    
    loans.push(loan);
  }
  
  return loans;
}

export function generateSampleLoanTapes(): { [key: string]: Blob[] } {
  const sampleTapes: { [key: string]: Blob[] } = {
    'small': [],
    'medium': [],
    'large': [],
    'xlarge': []
  };
  
  Object.entries(NBFC_PROFILES).forEach(([bucketKey, profile]) => {
    for (let i = 1; i <= 10; i++) {
      const nbfcName = `${profile.aumBucket.replace(/[^\w]/g, '')}NBFC${i}`;
      const loanCount = Math.floor(profile.totalLoans / 10) + getRandomNumber(-100, 100);
      
      const loanData = generateLoanData(profile, loanCount, nbfcName);
      
      // Create Excel workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(loanData);
      
      // Add some styling and formatting
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      
      // Auto-width columns
      const colWidths = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellAddress];
          if (cell && cell.v) {
            const cellLength = cell.v.toString().length;
            if (cellLength > maxWidth) maxWidth = cellLength;
          }
        }
        colWidths.push({ wch: Math.min(maxWidth + 2, 30) });
      }
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Loan Tape');
      
      // Add summary sheet
      const summaryData = [
        ['NBFC Name', nbfcName],
        ['AUM Bucket', profile.aumBucket],
        ['Total Loans', loanCount],
        ['Portfolio Value (₹)', profile.portfolioValue.toLocaleString('en-IN')],
        ['Average Loan Size (₹)', profile.avgLoanSize.toLocaleString('en-IN')],
        ['Risk Profile', profile.riskProfile],
        ['Geographic Focus', profile.geographicFocus.join(', ')],
        [''],
        ['Product Mix', ''],
        ...Object.entries(profile.productMix).map(([product, percentage]) => 
          [product, `${(percentage * 100).toFixed(1)}%`]
        )
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      
      // Convert to blob
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Add filename property for download
      (blob as any).filename = `${nbfcName}_LoanTape_Sample${i}.xlsx`;
      
      sampleTapes[bucketKey].push(blob);
    }
  });
  
  return sampleTapes;
}

export function downloadSampleTape(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAllSampleTapes() {
  const sampleTapes = generateSampleLoanTapes();
  
  Object.entries(sampleTapes).forEach(([bucketKey, blobs]) => {
    blobs.forEach((blob, index) => {
      setTimeout(() => {
        downloadSampleTape(blob, (blob as any).filename);
      }, index * 500); // Stagger downloads
    });
  });
}
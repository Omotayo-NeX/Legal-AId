/**
 * Nigerian PAYE Tax Calculator
 * Implements Finance Act rules with progressive tax bands
 */

export interface TaxInput {
  annualGross: number;
  basicSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
  pension?: number;        // Optional override, defaults to 8% of BHT
  nhf?: number;            // Optional override, defaults to 2.5% of basic
  nhis?: number;
  lifeInsurance?: number;
}

export interface TaxBandResult {
  band: string;
  amountTaxed: number;
  rate: number;
  tax: number;
}

export interface TaxResult {
  gross: number;
  cra: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBands: TaxBandResult[];
  totalTax: number;
  monthlyTax: number;
  effectiveRate: number;
  minimumTaxApplied: boolean;
  breakdown: {
    pension: number;
    nhf: number;
    nhis: number;
    lifeInsurance: number;
    totalStatutory: number;
  };
}

/**
 * Nigerian Tax Bands (2024)
 */
const TAX_BANDS = [
  { limit: 300000, rate: 0.07, label: 'First ₦300,000' },
  { limit: 300000, rate: 0.11, label: 'Next ₦300,000' },
  { limit: 500000, rate: 0.15, label: 'Next ₦500,000' },
  { limit: 500000, rate: 0.19, label: 'Next ₦500,000' },
  { limit: 1600000, rate: 0.21, label: 'Next ₦1,600,000' },
  { limit: Infinity, rate: 0.24, label: 'Above ₦3,200,000' },
];

export class NigeriaTaxService {
  /**
   * Calculate Consolidated Relief Allowance (CRA)
   * CRA = Higher of (₦200,000 or 1% of gross) + 20% of gross
   */
  private static calculateCRA(grossIncome: number): number {
    const higherOf200kOr1Percent = Math.max(200000, grossIncome * 0.01);
    const twentyPercentOfGross = grossIncome * 0.20;
    return higherOf200kOr1Percent + twentyPercentOfGross;
  }

  /**
   * Calculate pension contribution (8% of Basic + Housing + Transport)
   */
  private static calculatePension(
    basic: number,
    housing: number,
    transport: number
  ): number {
    const bht = basic + housing + transport;
    return bht * 0.08;
  }

  /**
   * Calculate NHF (2.5% of basic salary)
   */
  private static calculateNHF(basic: number): number {
    return basic * 0.025;
  }

  /**
   * Apply progressive tax bands
   */
  private static applyTaxBands(taxableIncome: number): TaxBandResult[] {
    const results: TaxBandResult[] = [];
    let remaining = taxableIncome;
    let cumulativeLimit = 0;

    for (const band of TAX_BANDS) {
      if (remaining <= 0) break;

      const bandLimit = band.limit === Infinity ? remaining : band.limit;
      const amountInBand = Math.min(remaining, bandLimit);
      const tax = amountInBand * band.rate;

      results.push({
        band: band.label,
        amountTaxed: amountInBand,
        rate: band.rate,
        tax: tax,
      });

      remaining -= amountInBand;
      cumulativeLimit += bandLimit;
    }

    return results;
  }

  /**
   * Main tax calculation function
   */
  static calculateTax(input: TaxInput): TaxResult {
    const {
      annualGross,
      basicSalary = 0,
      housingAllowance = 0,
      transportAllowance = 0,
      nhis = 0,
      lifeInsurance = 0,
    } = input;

    // Calculate statutory deductions
    const pension = input.pension !== undefined
      ? input.pension
      : this.calculatePension(basicSalary, housingAllowance, transportAllowance);

    const nhf = input.nhf !== undefined
      ? input.nhf
      : this.calculateNHF(basicSalary);

    // Total deductions (before tax)
    const totalDeductions = pension + nhf + nhis + lifeInsurance;

    // Calculate CRA
    const cra = this.calculateCRA(annualGross);

    // Taxable income = Gross - CRA - Deductions
    let taxableIncome = annualGross - cra - totalDeductions;

    // Apply zero tax rule for income ≤ ₦360,000
    if (annualGross <= 360000) {
      return {
        gross: annualGross,
        cra: cra,
        totalDeductions: totalDeductions,
        taxableIncome: 0,
        taxBands: [],
        totalTax: 0,
        monthlyTax: 0,
        effectiveRate: 0,
        minimumTaxApplied: false,
        breakdown: {
          pension,
          nhf,
          nhis,
          lifeInsurance,
          totalStatutory: pension + nhf,
        },
      };
    }

    // Apply progressive tax bands
    const taxBands = taxableIncome > 0 ? this.applyTaxBands(taxableIncome) : [];
    let totalTax = taxBands.reduce((sum, band) => sum + band.tax, 0);

    // Minimum tax rule: 1% of gross if CRA wipes out taxable income
    let minimumTaxApplied = false;
    if (taxableIncome <= 0 || totalTax === 0) {
      totalTax = annualGross * 0.01; // 1% minimum tax
      minimumTaxApplied = true;
    }

    // Calculate monthly tax
    const monthlyTax = totalTax / 12;

    // Calculate effective tax rate
    const effectiveRate = (totalTax / annualGross) * 100;

    return {
      gross: annualGross,
      cra: cra,
      totalDeductions: totalDeductions,
      taxableIncome: Math.max(0, taxableIncome),
      taxBands: taxBands,
      totalTax: totalTax,
      monthlyTax: monthlyTax,
      effectiveRate: effectiveRate,
      minimumTaxApplied: minimumTaxApplied,
      breakdown: {
        pension,
        nhf,
        nhis,
        lifeInsurance,
        totalStatutory: pension + nhf,
      },
    };
  }

  /**
   * Calculate monthly breakdown from annual values
   */
  static calculateMonthly(annualResult: TaxResult) {
    return {
      ...annualResult,
      gross: annualResult.gross / 12,
      cra: annualResult.cra / 12,
      totalDeductions: annualResult.totalDeductions / 12,
      taxableIncome: annualResult.taxableIncome / 12,
      totalTax: annualResult.monthlyTax,
      breakdown: {
        pension: annualResult.breakdown.pension / 12,
        nhf: annualResult.breakdown.nhf / 12,
        nhis: annualResult.breakdown.nhis / 12,
        lifeInsurance: annualResult.breakdown.lifeInsurance / 12,
        totalStatutory: annualResult.breakdown.totalStatutory / 12,
      },
    };
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }
}

/**
 * EXAMPLE USAGE:
 *
 * const result = NigeriaTaxService.calculateTax({
 *   annualGross: 5000000,
 *   basicSalary: 2000000,
 *   housingAllowance: 2000000,
 *   transportAllowance: 1000000,
 *   nhis: 15000,
 *   lifeInsurance: 50000,
 * });
 *
 * console.log('Annual Tax:', NigeriaTaxService.formatCurrency(result.totalTax));
 * console.log('Monthly Tax:', NigeriaTaxService.formatCurrency(result.monthlyTax));
 * console.log('Effective Rate:', NigeriaTaxService.formatPercentage(result.effectiveRate));
 */

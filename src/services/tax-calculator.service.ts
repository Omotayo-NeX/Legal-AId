import { TaxCalculationInput, TaxCalculationResult } from '../types';

/**
 * Nigerian Tax Calculator Service
 * Implements PAYE (Pay As You Earn) tax calculation based on Nigerian tax laws
 * Updated for current Nigerian tax rates and reliefs
 */

// Nigerian Tax Rates (Progressive Tax Brackets)
const TAX_BRACKETS = [
  { min: 0, max: 300000, rate: 0.07 }, // 7% on first ₦300,000
  { min: 300000, max: 600000, rate: 0.11 }, // 11% on next ₦300,000
  { min: 600000, max: 1100000, rate: 0.15 }, // 15% on next ₦500,000
  { min: 1100000, max: 1600000, rate: 0.19 }, // 19% on next ₦500,000
  { min: 1600000, max: 3200000, rate: 0.21 }, // 21% on next ₦1,600,000
  { min: 3200000, max: Infinity, rate: 0.24 }, // 24% on income above ₦3,200,000
];

// Consolidated Relief Allowance (CRA)
// CRA = Higher of ₦200,000 or 1% of gross income + 20% of gross income
const MIN_CRA = 200000;
const CRA_PERCENTAGE_1 = 0.01; // 1% of gross income
const CRA_PERCENTAGE_2 = 0.20; // 20% of gross income

export class TaxCalculatorService {
  /**
   * Calculate Consolidated Relief Allowance
   */
  private static calculateCRA(grossIncome: number): number {
    const calculatedCRA = grossIncome * CRA_PERCENTAGE_1 + grossIncome * CRA_PERCENTAGE_2;
    return Math.max(MIN_CRA, calculatedCRA);
  }

  /**
   * Calculate total deductions
   */
  private static calculateTotalDeductions(
    deductions?: TaxCalculationInput['deductions']
  ): number {
    if (!deductions) return 0;

    const { pension = 0, nhf = 0, nhis = 0, life_insurance = 0 } = deductions;
    return pension + nhf + nhis + life_insurance;
  }

  /**
   * Calculate tax based on progressive tax brackets
   */
  private static calculateProgressiveTax(taxableIncome: number): {
    breakdown: { bracket: string; amount: number; tax: number }[];
    totalTax: number;
  } {
    const breakdown: { bracket: string; amount: number; tax: number }[] = [];
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const bracket = TAX_BRACKETS[i];
      const bracketSize = bracket.max === Infinity
        ? remainingIncome
        : Math.min(bracket.max - bracket.min, remainingIncome);

      if (bracketSize <= 0) break;

      const taxForBracket = bracketSize * bracket.rate;
      totalTax += taxForBracket;

      breakdown.push({
        bracket: `${this.formatCurrency(bracket.min)} - ${
          bracket.max === Infinity
            ? 'above'
            : this.formatCurrency(bracket.max)
        } (${(bracket.rate * 100).toFixed(0)}%)`,
        amount: bracketSize,
        tax: taxForBracket,
      });

      remainingIncome -= bracketSize;

      if (remainingIncome <= 0) break;
    }

    return { breakdown, totalTax };
  }

  /**
   * Format number as Nigerian currency
   */
  private static formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  /**
   * Main tax calculation method
   */
  static calculateTax(input: TaxCalculationInput): TaxCalculationResult {
    const { gross_income, deductions } = input;

    // Step 1: Calculate Consolidated Relief Allowance
    const consolidatedRelief = this.calculateCRA(gross_income);

    // Step 2: Calculate total deductions
    const totalDeductions = this.calculateTotalDeductions(deductions);

    // Step 3: Calculate taxable income
    // Taxable Income = Gross Income - CRA - Deductions
    const taxableIncome = Math.max(
      0,
      gross_income - consolidatedRelief - totalDeductions
    );

    // Step 4: Calculate tax using progressive brackets
    const { breakdown, totalTax } = this.calculateProgressiveTax(taxableIncome);

    // Step 5: Calculate net income
    const netIncome = gross_income - totalTax;

    return {
      gross_income,
      consolidated_relief: consolidatedRelief,
      total_deductions: totalDeductions,
      taxable_income: taxableIncome,
      tax_breakdown: breakdown,
      total_tax: totalTax,
      net_income: netIncome,
    };
  }

  /**
   * Calculate monthly PAYE from annual figures
   */
  static calculateMonthlyPAYE(annualGrossIncome: number): {
    monthlyGross: number;
    monthlyTax: number;
    monthlyNet: number;
  } {
    const result = this.calculateTax({
      gross_income: annualGrossIncome,
      type: 'employee',
    });

    return {
      monthlyGross: annualGrossIncome / 12,
      monthlyTax: result.total_tax / 12,
      monthlyNet: result.net_income / 12,
    };
  }

  /**
   * Calculate annual from monthly gross income
   */
  static calculateAnnualFromMonthly(monthlyGross: number): TaxCalculationResult {
    const annualGross = monthlyGross * 12;
    return this.calculateTax({
      gross_income: annualGross,
      type: 'employee',
    });
  }

  /**
   * Get suggested deductions based on gross income
   */
  static getSuggestedDeductions(grossIncome: number): {
    pension: number;
    nhf: number;
    nhis: number;
  } {
    // Pension: 8% of monthly basic salary (estimated as 70% of gross)
    const monthlyGross = grossIncome / 12;
    const estimatedBasic = monthlyGross * 0.7;
    const pension = estimatedBasic * 0.08 * 12; // Annual

    // NHF: 2.5% of monthly basic salary
    const nhf = estimatedBasic * 0.025 * 12; // Annual

    // NHIS: Varies, typical employee contribution
    const nhis = 5000 * 12; // ₦5,000 per month estimate

    return { pension, nhf, nhis };
  }
}

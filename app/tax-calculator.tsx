import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors, typography } from '../src/theme';
import { NigeriaTaxService, TaxResult } from '../src/services/nigeria-tax.service';

export default function TaxCalculatorScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');

  // Form inputs
  const [annualGross, setAnnualGross] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [housingAllowance, setHousingAllowance] = useState('');
  const [transportAllowance, setTransportAllowance] = useState('');
  const [nhis, setNhis] = useState('');
  const [lifeInsurance, setLifeInsurance] = useState('');

  // Results
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const formatInput = (value: string): string => {
    const num = value.replace(/[^0-9]/g, '');
    return num ? parseInt(num).toLocaleString() : '';
  };

  const autoFillStatutory = () => {
    const gross = parseNumber(annualGross);
    const basic = parseNumber(basicSalary);

    if (!gross || !basic) {
      Alert.alert('Info', 'Please enter Annual Gross and Basic Salary first');
      return;
    }

    // Auto-suggest reasonable breakdown if not entered
    if (!parseNumber(housingAllowance) && !parseNumber(transportAllowance)) {
      const suggestedBasic = gross * 0.4;
      const suggestedHousing = gross * 0.4;
      const suggestedTransport = gross * 0.2;

      Alert.alert(
        'Suggested Breakdown',
        `Based on ₦${formatInput(annualGross)} gross:\n\n` +
        `Basic: ₦${suggestedBasic.toLocaleString()} (40%)\n` +
        `Housing: ₦${suggestedHousing.toLocaleString()} (40%)\n` +
        `Transport: ₦${suggestedTransport.toLocaleString()} (20%)\n\n` +
        'Would you like to use these values?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Apply',
            onPress: () => {
              setBasicSalary(formatInput(suggestedBasic.toString()));
              setHousingAllowance(formatInput(suggestedHousing.toString()));
              setTransportAllowance(formatInput(suggestedTransport.toString()));
            },
          },
        ]
      );
    }
  };

  const calculateTax = () => {
    const gross = parseNumber(annualGross);

    if (!gross || gross <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid Annual Gross Income');
      return;
    }

    try {
      const taxResult = NigeriaTaxService.calculateTax({
        annualGross: gross,
        basicSalary: parseNumber(basicSalary),
        housingAllowance: parseNumber(housingAllowance),
        transportAllowance: parseNumber(transportAllowance),
        nhis: parseNumber(nhis),
        lifeInsurance: parseNumber(lifeInsurance),
      });

      setResult(taxResult);
      setShowBreakdown(true);
    } catch (error) {
      console.error('Tax calculation error:', error);
      Alert.alert('Error', 'Failed to calculate tax. Please check your inputs.');
    }
  };

  const clearForm = () => {
    setAnnualGross('');
    setBasicSalary('');
    setHousingAllowance('');
    setTransportAllowance('');
    setNhis('');
    setLifeInsurance('');
    setResult(null);
    setShowBreakdown(false);
  };

  const displayValue = (annual: number) => {
    return viewMode === 'monthly' ? annual / 12 : annual;
  };

  const generatePDF = async () => {
    if (!result) return;

    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tax Calculation Report</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                padding: 0;
                margin: 0;
                color: #333;
                font-size: 12px;
                line-height: 1.4;
              }
              .container {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #1BAA66;
                padding-bottom: 15px;
                margin-bottom: 20px;
                page-break-after: avoid;
              }
              .header h1 {
                color: #0C1D2C;
                margin: 0 0 8px 0;
                font-size: 22px;
              }
              .header p {
                color: #666;
                margin: 3px 0;
                font-size: 11px;
              }
              .section {
                margin-bottom: 20px;
                page-break-inside: avoid;
              }
              .section-title {
                color: #0C1D2C;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                border-bottom: 1.5px solid #1BAA66;
                padding-bottom: 4px;
              }
              .row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 0.5px solid #eee;
                font-size: 11px;
              }
              .row.highlight {
                background-color: #f0f9ff;
                padding: 10px;
                margin: 8px 0;
                border-radius: 6px;
                border: 1px solid #1BAA66;
              }
              .label {
                color: #666;
                font-weight: 500;
              }
              .value {
                color: #0C1D2C;
                font-weight: bold;
                text-align: right;
              }
              .value.primary {
                color: #1BAA66;
                font-size: 16px;
              }
              .badge {
                display: inline-block;
                background-color: #FFA726;
                color: white;
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 9px;
                margin-left: 8px;
              }
              .tax-bands {
                margin-top: 10px;
              }
              .band {
                padding: 8px;
                background-color: #f9f9f9;
                margin-bottom: 8px;
                border-radius: 4px;
                page-break-inside: avoid;
              }
              .band-header {
                font-weight: bold;
                color: #0C1D2C;
                font-size: 11px;
                margin-bottom: 4px;
              }
              .band-details {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #666;
              }
              .band-tax {
                color: #1BAA66;
                font-weight: bold;
              }
              .footer {
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                text-align: center;
                color: #666;
                font-size: 10px;
                page-break-inside: avoid;
              }
              .disclaimer {
                background-color: #fff3cd;
                border-left: 3px solid #FFA726;
                padding: 12px;
                margin-top: 15px;
                border-radius: 4px;
                font-size: 10px;
                line-height: 1.5;
                page-break-inside: avoid;
              }
              .disclaimer strong {
                font-size: 11px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PAYE Tax Calculation Report</h1>
                <p>Nigerian Tax Laws 2024</p>
                <p>Generated on ${new Date().toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>

              <div class="section">
                <div class="section-title">Income Summary</div>
                <div class="row">
                  <span class="label">Annual Gross Income</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.gross)}</span>
                </div>
                <div class="row">
                  <span class="label">Consolidated Relief Allowance (CRA)</span>
                  <span class="value">- ${NigeriaTaxService.formatCurrency(result.cra)}</span>
                </div>
                <div class="row">
                  <span class="label">Total Deductions</span>
                  <span class="value">- ${NigeriaTaxService.formatCurrency(result.totalDeductions)}</span>
                </div>
                <div class="row highlight">
                  <span class="label">Taxable Income</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.taxableIncome)}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Tax Calculation ${result.minimumTaxApplied ? '<span class="badge">Min Tax</span>' : ''}</div>
                <div class="row">
                  <span class="label">Annual Tax</span>
                  <span class="value primary">${NigeriaTaxService.formatCurrency(result.totalTax)}</span>
                </div>
                <div class="row">
                  <span class="label">Monthly Tax</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.monthlyTax)}</span>
                </div>
                <div class="row">
                  <span class="label">Effective Tax Rate</span>
                  <span class="value">${NigeriaTaxService.formatPercentage(result.effectiveRate)}</span>
                </div>
              </div>

              ${result.taxBands.length > 0 ? `
              <div class="section">
                <div class="section-title">Tax Band Breakdown</div>
                <div class="tax-bands">
                  ${result.taxBands.map(band => `
                    <div class="band">
                      <div class="band-header">${band.band}</div>
                      <div class="band-details">
                        <span>${NigeriaTaxService.formatCurrency(band.amountTaxed)} @ ${NigeriaTaxService.formatPercentage(band.rate * 100)}</span>
                        <span class="band-tax">${NigeriaTaxService.formatCurrency(band.tax)}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              <div class="section">
                <div class="section-title">Deductions Breakdown</div>
                <div class="row">
                  <span class="label">Pension (8% of BHT)</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.breakdown.pension)}</span>
                </div>
                <div class="row">
                  <span class="label">NHF (2.5% of Basic)</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.breakdown.nhf)}</span>
                </div>
                ${result.breakdown.nhis > 0 ? `
                <div class="row">
                  <span class="label">NHIS</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.breakdown.nhis)}</span>
                </div>
                ` : ''}
                ${result.breakdown.lifeInsurance > 0 ? `
                <div class="row">
                  <span class="label">Life Insurance</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.breakdown.lifeInsurance)}</span>
                </div>
                ` : ''}
                <div class="row highlight">
                  <span class="label">Total Statutory</span>
                  <span class="value">${NigeriaTaxService.formatCurrency(result.breakdown.totalStatutory)}</span>
                </div>
              </div>

              <div class="disclaimer">
                <strong>Disclaimer:</strong> This calculation is based on the Nigerian Finance Act 2024 and is provided for informational purposes only. For specific tax advice, please consult with a qualified tax professional or the Federal Inland Revenue Service (FIRS).
              </div>

              <div class="footer">
                <p>Generated by Legal AI.d - Your Nigerian Legal Assistant</p>
                <p>www.legalaid.ng</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
      });

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Tax Calculation Report',
          UTI: 'com.adobe.pdf',
        });
      }

      Alert.alert('Success', 'PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PAYE Tax Calculator</Text>
          <Text style={styles.headerSubtitle}>Nigerian Tax Laws 2024</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* View Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'annual' && styles.toggleButtonActive]}
            onPress={() => setViewMode('annual')}
          >
            <Text style={[styles.toggleText, viewMode === 'annual' && styles.toggleTextActive]}>
              Annual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'monthly' && styles.toggleButtonActive]}
            onPress={() => setViewMode('monthly')}
          >
            <Text style={[styles.toggleText, viewMode === 'monthly' && styles.toggleTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Income Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Gross Income *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5,000,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={annualGross}
              onChangeText={(text) => setAnnualGross(formatInput(text))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Basic Salary</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2,000,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={basicSalary}
              onChangeText={(text) => setBasicSalary(formatInput(text))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Housing Allowance</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2,000,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={housingAllowance}
              onChangeText={(text) => setHousingAllowance(formatInput(text))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transport Allowance</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1,000,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={transportAllowance}
              onChangeText={(text) => setTransportAllowance(formatInput(text))}
            />
          </View>

          <TouchableOpacity style={styles.autoFillButton} onPress={autoFillStatutory}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={styles.autoFillText}>Auto-suggest Breakdown</Text>
          </TouchableOpacity>
        </View>

        {/* Deductions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deductions (Optional)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NHIS Contribution</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 15,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={nhis}
              onChangeText={(text) => setNhis(formatInput(text))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Life Insurance Premium</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50,000"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={lifeInsurance}
              onChangeText={(text) => setLifeInsurance(formatInput(text))}
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color={colors.info} />
            <Text style={styles.infoText}>
              Pension (8% of BHT) and NHF (2.5% of basic) are auto-calculated
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={clearForm}>
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={calculateTax}>
            <Ionicons name="calculator" size={20} color={colors.white} />
            <Text style={styles.primaryButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <>
            {/* Summary Card */}
            <View style={[styles.card, styles.resultCard]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>
                  {viewMode === 'annual' ? 'Annual' : 'Monthly'} Tax Summary
                </Text>
                {result.minimumTaxApplied && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Min Tax</Text>
                  </View>
                )}
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Gross Income</Text>
                <Text style={styles.resultValue}>
                  {NigeriaTaxService.formatCurrency(displayValue(result.gross))}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CRA</Text>
                <Text style={styles.resultValue}>
                  - {NigeriaTaxService.formatCurrency(displayValue(result.cra))}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Deductions</Text>
                <Text style={styles.resultValue}>
                  - {NigeriaTaxService.formatCurrency(displayValue(result.totalDeductions))}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Taxable Income</Text>
                <Text style={styles.resultValue}>
                  {NigeriaTaxService.formatCurrency(displayValue(result.taxableIncome))}
                </Text>
              </View>

              <View style={[styles.resultRow, styles.taxRow]}>
                <Text style={styles.taxLabel}>
                  {viewMode === 'annual' ? 'Annual' : 'Monthly'} Tax
                </Text>
                <Text style={styles.taxValue}>
                  {NigeriaTaxService.formatCurrency(
                    viewMode === 'annual' ? result.totalTax : result.monthlyTax
                  )}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Effective Rate</Text>
                <Text style={[styles.resultValue, { color: colors.primary }]}>
                  {NigeriaTaxService.formatPercentage(result.effectiveRate)}
                </Text>
              </View>
            </View>

            {/* Tax Breakdown */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <View style={styles.breakdownHeader}>
                <Text style={styles.cardTitle}>Tax Band Breakdown</Text>
                <Ionicons
                  name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.text.secondary}
                />
              </View>

              {showBreakdown && result.taxBands.length > 0 && (
                <View style={styles.breakdownContent}>
                  {result.taxBands.map((band, index) => (
                    <View key={index} style={styles.bandRow}>
                      <View style={styles.bandLeft}>
                        <Text style={styles.bandLabel}>{band.band}</Text>
                        <Text style={styles.bandAmount}>
                          {NigeriaTaxService.formatCurrency(displayValue(band.amountTaxed))}
                        </Text>
                      </View>
                      <View style={styles.bandRight}>
                        <Text style={styles.bandRate}>
                          {NigeriaTaxService.formatPercentage(band.rate * 100)}
                        </Text>
                        <Text style={styles.bandTax}>
                          {NigeriaTaxService.formatCurrency(displayValue(band.tax))}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.divider} />

                  <View style={styles.deductionsBreakdown}>
                    <Text style={styles.breakdownTitle}>Deductions Detail</Text>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Pension (8%)</Text>
                      <Text style={styles.resultValue}>
                        {NigeriaTaxService.formatCurrency(displayValue(result.breakdown.pension))}
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>NHF (2.5%)</Text>
                      <Text style={styles.resultValue}>
                        {NigeriaTaxService.formatCurrency(displayValue(result.breakdown.nhf))}
                      </Text>
                    </View>
                    {result.breakdown.nhis > 0 && (
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>NHIS</Text>
                        <Text style={styles.resultValue}>
                          {NigeriaTaxService.formatCurrency(displayValue(result.breakdown.nhis))}
                        </Text>
                      </View>
                    )}
                    {result.breakdown.lifeInsurance > 0 && (
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Life Insurance</Text>
                        <Text style={styles.resultValue}>
                          {NigeriaTaxService.formatCurrency(displayValue(result.breakdown.lifeInsurance))}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Export Button */}
            <TouchableOpacity style={styles.exportButton} onPress={generatePDF}>
              <Ionicons name="document-text" size={20} color={colors.white} />
              <Text style={styles.exportButtonText}>Export as PDF</Text>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.disclaimerCard}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              <Text style={styles.disclaimerText}>
                Calculations based on Nigerian Finance Act 2024. Consult a tax professional for
                specific cases.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.secondary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 22,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.primary,
    marginTop: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    ...typography.body1,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...colors.shadows?.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    ...typography.body1,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary + '15',
    borderRadius: 10,
    gap: 6,
  },
  autoFillText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '10',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  infoText: {
    ...typography.caption,
    color: colors.info,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.h4,
    color: colors.text.secondary,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: colors.primary + '05',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  badge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
    fontSize: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  resultValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  taxRow: {
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  taxLabel: {
    ...typography.h4,
    color: colors.primary,
  },
  taxValue: {
    ...typography.h3,
    color: colors.primary,
    fontSize: 20,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownContent: {
    marginTop: 16,
  },
  bandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bandLeft: {
    flex: 1,
  },
  bandLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  bandAmount: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  bandRight: {
    alignItems: 'flex-end',
  },
  bandRate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  bandTax: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '700',
  },
  deductionsBreakdown: {
    marginTop: 16,
  },
  breakdownTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    ...colors.shadows?.md,
  },
  exportButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
});

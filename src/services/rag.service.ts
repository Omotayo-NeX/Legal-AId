/**
 * RAG (Retrieval-Augmented Generation) Service
 * Provides context-aware legal compliance answers using Nigerian knowledge base
 */

import Constants from 'expo-constants';

// Knowledge base types
export interface ComplianceKnowledge {
  id: string;
  topic: string;
  audience: string[];
  jurisdiction: string;
  question: string;
  answer_markdown: string;
  key_points: string[];
  compliance_checklist: string[];
  effective_date: string;
  review_cycle_days: number;
  citations: Array<{
    title: string;
    url: string;
  }>;
  tags: string[];
}

export interface RetrievalResult {
  knowledge: ComplianceKnowledge;
  relevanceScore: number;
  matchedTerms: string[];
}

export class RAGService {
  private static knowledgeBase: ComplianceKnowledge[] = [];
  private static initialized = false;

  /**
   * Initialize the knowledge base from JSONL file
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // In React Native, we'll load from a hardcoded dataset or remote endpoint
      // For now, using embedded knowledge base
      const knowledgeData = await this.loadKnowledgeBase();
      this.knowledgeBase = knowledgeData;
      this.initialized = true;
      console.log(`RAG Service initialized with ${this.knowledgeBase.length} knowledge entries`);
    } catch (error) {
      console.error('Failed to initialize RAG service:', error);
      // Don't throw - fallback to non-RAG mode
    }
  }

  /**
   * Load knowledge base from bundled data
   */
  private static async loadKnowledgeBase(): Promise<ComplianceKnowledge[]> {
    // Import the JSONL data as an array
    const knowledgeBase: ComplianceKnowledge[] = [
      {
        id: 'cac-001',
        topic: 'cac_business_name_registration',
        audience: ['freelancer', 'sme_owner'],
        jurisdiction: 'NG',
        question: 'How do I register a Business Name with CAC in Nigeria?',
        answer_markdown: '# Business Name Registration\n\nA **Business Name** is the simplest legal structure for sole proprietors and partnerships in Nigeria.\n\n## Requirements\n- Valid means of ID (NIN, Voter\'s Card, Int\'l Passport)\n- Proposed business name (check availability on CAC portal)\n- Business address proof\n- ₦10,000 registration fee\n\n## Process\n1. Name search on CAC portal (https://pre.cac.gov.ng)\n2. Reserve name (₦500)\n3. Complete online application (Form BN1)\n4. Pay ₦10,000 via Remita\n5. Receive certificate electronically (1-3 days)\n\n## Annual Obligations\n- File annual returns (Form BN2) every year\n- Fee: ₦5,000\n- Deadline: Within 90 days of anniversary\n\n⚠️ Business Name does NOT create separate legal entity—owner is personally liable.',
        key_points: [
          'Business Name costs ₦10,000 to register',
          'Owner has unlimited personal liability',
          'Must file annual returns (₦5,000/year)',
          'Registration completed online via CAC portal',
          'Certificate issued within 1-3 days',
        ],
        compliance_checklist: [
          'Search and reserve business name on CAC portal',
          'Prepare valid ID and address proof',
          'Complete Form BN1 online',
          'Pay ₦10,000 registration fee',
          'Download certificate',
          'File Form BN2 annually before 90-day deadline',
        ],
        effective_date: '2020-08-31',
        review_cycle_days: 180,
        citations: [
          {
            title: 'CAC Business Name Registration Portal',
            url: 'https://pre.cac.gov.ng',
          },
          {
            title: 'Companies and Allied Matters Act 2020',
            url: 'https://www.cac.gov.ng/home/cama-2020/',
          },
        ],
        tags: ['cac', 'business_registration', 'freelancer', 'sole_proprietor'],
      },
      {
        id: 'firs-001',
        topic: 'tin_registration',
        audience: ['freelancer', 'sme_owner', 'finance_ops'],
        jurisdiction: 'NG',
        question: 'How do I obtain a Tax Identification Number (TIN) in Nigeria?',
        answer_markdown: '# Tax Identification Number (TIN)\n\n## What is TIN?\n**TIN** is a unique 10-digit number issued by FIRS for tax identification and filing.\n\n## Who Needs TIN?\n- All individuals earning taxable income\n- All registered businesses (Business Name, Ltd)\n- Freelancers and consultants\n- Employees (employer applies)\n\n## How to Register\n1. Visit FIRS TaxPro-Max portal (https://taxpromax.firs.gov.ng)\n2. Click **Register for TIN**\n3. Provide: Full name, BVN, email, phone, address\n4. Upload valid ID (NIN, passport, driver\'s license)\n5. Submit application\n6. Receive TIN via email (1-3 days)\n\n## For Companies\n- Apply within 6 months of CAC registration\n- Upload CAC certificate and Memorandum & Articles\n\n## Cost\n**Free**—no payment required.\n\n⚠️ TIN is required to open corporate bank accounts and file tax returns.',
        key_points: [
          'TIN is free and mandatory for all taxpayers',
          'Register online at TaxPro-Max portal',
          'Individual TIN requires BVN and valid ID',
          'Companies must apply within 6 months of CAC registration',
          'TIN issued within 1-3 days electronically',
        ],
        compliance_checklist: [
          'Visit FIRS TaxPro-Max portal',
          'Complete online registration form',
          'Upload valid ID and BVN (individuals)',
          'Upload CAC certificate (companies)',
          'Submit application',
          'Check email for TIN within 3 days',
          'Use TIN for all tax filings and bank accounts',
        ],
        effective_date: '2020-01-01',
        review_cycle_days: 365,
        citations: [
          {
            title: 'FIRS TaxPro-Max Portal',
            url: 'https://taxpromax.firs.gov.ng',
          },
          {
            title: 'Federal Inland Revenue Service',
            url: 'https://www.firs.gov.ng',
          },
        ],
        tags: ['firs', 'tin', 'tax_registration', 'compliance'],
      },
      {
        id: 'firs-002',
        topic: 'vat_registration_threshold',
        audience: ['freelancer', 'sme_owner'],
        jurisdiction: 'NG',
        question: 'When must I register for VAT in Nigeria and what is the threshold?',
        answer_markdown: '# VAT Registration in Nigeria\n\n## VAT Rate\n**7.5%** on taxable goods and services (increased from 5% in 2020).\n\n## Registration Threshold\n- **Mandatory**: Annual turnover of ₦25 million or more\n- **Voluntary**: Below ₦25M but selling VATable goods/services\n\n## Who Must Register?\n- Companies selling goods/services in Nigeria\n- Freelancers earning ₦25M+ annually\n- E-commerce businesses\n- Foreign digital services providers (Netflix, Google, etc.)\n\n## Registration Process\n1. Visit FIRS TaxPro-Max portal\n2. Complete VAT registration form\n3. Upload TIN, CAC certificate, business proof\n4. Receive VAT Registration Certificate\n\n## Compliance\n- File monthly VAT returns (21st of following month)\n- Remit VAT collected to FIRS\n- Issue VAT-compliant invoices\n\n## Penalties\n- Late filing: ₦50,000 first month, ₦25,000/month thereafter\n- Late remittance: 10% penalty + 21% annual interest',
        key_points: [
          'VAT rate is 7.5% (effective February 2020)',
          'Register if turnover exceeds ₦25 million annually',
          'File monthly VAT returns by 21st of next month',
          'Penalty: ₦50,000 for late filing, 10% for late payment',
          'Freelancers under threshold not required to register',
        ],
        compliance_checklist: [
          'Calculate annual turnover',
          'Register on TaxPro-Max if above ₦25M',
          'Issue VAT-compliant invoices with TIN and VAT number',
          'Collect 7.5% VAT from customers',
          'File monthly VAT returns by 21st',
          'Remit VAT to FIRS within 21 days',
          'Keep VAT records for 6 years',
        ],
        effective_date: '2020-02-01',
        review_cycle_days: 90,
        citations: [
          {
            title: 'VAT Act (Amendment) 2020',
            url: 'https://www.firs.gov.ng',
          },
          {
            title: 'FIRS VAT Guidelines',
            url: 'https://www.firs.gov.ng/vat',
          },
        ],
        tags: ['firs', 'vat', 'tax_registration', 'threshold'],
      },
      {
        id: 'firs-003',
        topic: 'paye_employer_obligations',
        audience: ['sme_owner', 'hr_ops'],
        jurisdiction: 'NG',
        question: 'What are my PAYE obligations as an employer in Nigeria?',
        answer_markdown: '# PAYE Employer Obligations\n\n## What is PAYE?\n**Pay As You Earn** = income tax deducted from employee salaries monthly.\n\n## Registration\n- Register with FIRS within 6 months of hiring first employee\n- Obtain PAYE Tax Office (nearest to business address)\n- Use TaxPro-Max portal\n\n## Monthly Obligations\n1. **Deduct tax** from gross salary using PAYE tax tables\n2. **Remit to FIRS** by 10th of following month\n3. **File monthly returns** via TaxPro-Max (Form PAYE 001)\n\n## Annual Obligations\n- Submit **Annual Tax Returns** (Form PAYE 002) by January 31\n- Issue employees **Annual Tax Deduction Cards** (Form PAYE 003)\n\n## Tax Rates (2024)\n- First ₦300k: 7%\n- Next ₦300k: 11%\n- Next ₦500k: 15%\n- Next ₦500k: 19%\n- Next ₦1.6M: 21%\n- Above ₦3.2M: 24%\n\n## Penalties\n- Late remittance: 10% penalty + 21% annual interest\n- Failure to deduct: Employer liable for tax',
        key_points: [
          'Register for PAYE within 6 months of hiring',
          'Deduct tax monthly using progressive rates',
          'Remit to FIRS by 10th of next month',
          'File annual returns by January 31',
          'Late payment penalty: 10% + 21% interest',
        ],
        compliance_checklist: [
          'Register with FIRS PAYE office',
          'Assign employees to correct tax office',
          'Calculate monthly PAYE using official rates',
          'Deduct from salaries before payment',
          'Remit to FIRS by 10th of next month',
          'File monthly returns on TaxPro-Max',
          'Issue annual tax cards to employees by January 31',
          'Keep payroll records for 6 years',
        ],
        effective_date: '2024-01-01',
        review_cycle_days: 90,
        citations: [
          {
            title: 'Personal Income Tax Act (PITA)',
            url: 'https://www.firs.gov.ng',
          },
          {
            title: 'FIRS PAYE Guidelines 2024',
            url: 'https://www.firs.gov.ng/paye',
          },
        ],
        tags: ['firs', 'paye', 'payroll', 'employer_obligations'],
      },
      {
        id: 'firs-004',
        topic: 'freelancer_tax_obligations',
        audience: ['freelancer'],
        jurisdiction: 'NG',
        question: 'What are my tax obligations as a freelancer or independent contractor in Nigeria?',
        answer_markdown: '# Freelancer Tax Obligations\n\n## Who is a Freelancer?\nSelf-employed individuals providing services (writers, designers, developers, consultants).\n\n## Tax Registration\n1. Obtain **TIN** (free on TaxPro-Max)\n2. Register **Business Name** with CAC (optional but recommended)\n3. Register for **VAT** if earning ₦25M+ annually\n\n## Income Tax\n- File **annual self-assessment** by March 31\n- Pay tax on net profit (income minus expenses)\n- Use **Presumptive Tax** if turnover < ₦25M (3% of turnover)\n\n## VAT\n- Charge 7.5% VAT if registered\n- File monthly VAT returns by 21st\n\n## Withholding Tax (WHT)\n- Clients may deduct 5-10% WHT from invoices\n- Credit WHT against annual tax liability\n\n## Record-Keeping\n- Keep invoices, receipts, bank statements (6 years)\n\n## Penalties\n- Late filing: ₦25,000/year\n- Non-filing: Criminal prosecution possible',
        key_points: [
          'Register for TIN (mandatory and free)',
          'File annual tax returns by March 31',
          'Presumptive tax option: 3% of turnover if under ₦25M',
          'VAT registration required if earning ₦25M+',
          'Clients may deduct 5-10% WHT—claim credit on tax return',
        ],
        compliance_checklist: [
          'Obtain TIN from FIRS',
          'Register Business Name (optional)',
          'Track all income and expenses monthly',
          'Issue invoices with TIN',
          'Register for VAT if turnover exceeds ₦25M',
          'File annual self-assessment by March 31',
          'Pay tax liability or claim refund',
          'Keep records for 6 years',
        ],
        effective_date: '2024-01-01',
        review_cycle_days: 90,
        citations: [
          {
            title: 'Personal Income Tax Act',
            url: 'https://www.firs.gov.ng',
          },
          {
            title: 'FIRS Self-Assessment Guide',
            url: 'https://taxpromax.firs.gov.ng',
          },
        ],
        tags: ['firs', 'freelancer', 'self_assessment', 'income_tax', 'vat'],
      },
      {
        id: 'ndpa-001',
        topic: 'ndpa_2023_overview',
        audience: ['sme_owner', 'finance_ops', 'hr_ops'],
        jurisdiction: 'NG',
        question: 'What is the Nigeria Data Protection Act 2023 and who does it apply to?',
        answer_markdown: '# Nigeria Data Protection Act (NDPA) 2023\n\n## What is NDPA?\nComprehensive law regulating **personal data processing** in Nigeria, effective **June 14, 2023**.\n\n## Who Must Comply?\n- All organizations processing personal data in Nigeria\n- Nigerian companies processing data abroad\n- Foreign companies processing Nigerian residents\' data\n\n## Key Definitions\n- **Personal Data**: Any information relating to an identified/identifiable person\n- **Data Controller**: Organization determining purpose and means of processing\n- **Data Processor**: Organization processing data on behalf of controller\n\n## Data Protection Principles\n1. **Lawfulness** and consent\n2. **Purpose limitation**\n3. **Data minimization**\n4. **Accuracy**\n5. **Storage limitation**\n6. **Security**\n7. **Accountability**\n\n## Penalties\n- Non-compliance: Up to **2% of annual gross revenue** or ₦10 million (whichever is higher)\n- Data breach: Up to **₦25 million** or 1% of revenue\n\n⚠️ All organizations must register with **Nigeria Data Protection Commission (NDPC)**.',
        key_points: [
          'NDPA 2023 effective June 14, 2023',
          'Applies to all organizations processing Nigerian personal data',
          'Must register with NDPC',
          'Penalties up to 2% of revenue or ₦10M',
          'Data breach fine: ₦25M or 1% of revenue',
        ],
        compliance_checklist: [
          'Conduct data audit (what personal data you collect)',
          'Identify legal basis for processing (consent, contract, etc.)',
          'Register with NDPC (https://ndpc.gov.ng)',
          'Appoint Data Protection Officer (if required)',
          'Implement data security measures',
          'Draft Privacy Policy and publish on website',
          'Train staff on data protection',
          'Establish data breach response plan',
        ],
        effective_date: '2023-06-14',
        review_cycle_days: 90,
        citations: [
          {
            title: 'Nigeria Data Protection Act 2023',
            url: 'https://ndpc.gov.ng/ndpa-2023',
          },
          {
            title: 'Nigeria Data Protection Commission',
            url: 'https://ndpc.gov.ng',
          },
        ],
        tags: ['ndpa', 'data_protection', 'privacy', 'compliance'],
      },
      {
        id: 'pencom-001',
        topic: 'pension_employer_registration',
        audience: ['sme_owner', 'hr_ops'],
        jurisdiction: 'NG',
        question: 'How do I register as an employer with PenCom for pension contributions?',
        answer_markdown: '# PenCom Employer Registration\n\n## What is PenCom?\n**National Pension Commission**—regulates contributory pension scheme under **Pension Reform Act 2014**.\n\n## Who Must Register?\n- All employers with **5+ employees**\n- Federal, state, and private sector\n\n## Registration Process\n1. Obtain **TIN** from FIRS\n2. Register **CAC** (Business Name or Company)\n3. Visit PenCom portal (https://pencom.gov.ng)\n4. Complete **Employer Registration Form** (PEN 101)\n5. Upload CAC certificate, TIN, list of employees\n6. Select **Pension Fund Administrator (PFA)** for employees\n7. Receive Employer Registration Number (ERN)\n\n## Employee Enrollment\n- Each employee chooses PFA and opens Retirement Savings Account (RSA)\n- Provide employee RSA PIN to employer\n\n## Timeline\n- Register **within 3 months** of hiring 5th employee\n\n## Penalties\n- Non-registration: ₦500,000 or 2 years imprisonment\n\n⚠️ Employees earn at least **₦3,000/month** are eligible.',
        key_points: [
          'Register with PenCom if you have 5+ employees',
          'Obtain ERN via PenCom portal',
          'Employees choose PFA and open RSA account',
          'Must register within 3 months of hiring 5th employee',
          'Non-registration penalty: ₦500,000 or 2 years jail',
        ],
        compliance_checklist: [
          'Obtain TIN and CAC registration',
          'Register on PenCom portal',
          'Complete PEN 101 form',
          'Upload CAC certificate and TIN',
          'Enroll employees with PFA of their choice',
          'Obtain employee RSA PINs',
          'Receive Employer Registration Number (ERN)',
          'Maintain employee pension records',
        ],
        effective_date: '2014-07-01',
        review_cycle_days: 180,
        citations: [
          {
            title: 'Pension Reform Act 2014',
            url: 'https://pencom.gov.ng/pension-reform-act-2014/',
          },
          {
            title: 'PenCom Employer Registration',
            url: 'https://pencom.gov.ng',
          },
        ],
        tags: ['pencom', 'pension', 'employer_registration', 'compliance'],
      },
    ];

    return knowledgeBase;
  }

  /**
   * Simple text-based similarity scoring (cosine similarity approximation)
   * In production, use proper embeddings with OpenAI/Anthropic or local model
   */
  private static calculateSimilarity(query: string, document: string): number {
    const queryTerms = this.tokenize(query.toLowerCase());
    const docTerms = this.tokenize(document.toLowerCase());

    // Calculate term frequency
    const queryFreq = this.termFrequency(queryTerms);
    const docFreq = this.termFrequency(docTerms);

    // Calculate cosine similarity
    let dotProduct = 0;
    let queryMagnitude = 0;
    let docMagnitude = 0;

    const allTerms = new Set([...Object.keys(queryFreq), ...Object.keys(docFreq)]);

    for (const term of allTerms) {
      const qf = queryFreq[term] || 0;
      const df = docFreq[term] || 0;
      dotProduct += qf * df;
      queryMagnitude += qf * qf;
      docMagnitude += df * df;
    }

    if (queryMagnitude === 0 || docMagnitude === 0) return 0;

    return dotProduct / (Math.sqrt(queryMagnitude) * Math.sqrt(docMagnitude));
  }

  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2); // Filter out very short words
  }

  private static termFrequency(terms: string[]): Record<string, number> {
    const freq: Record<string, number> = {};
    for (const term of terms) {
      freq[term] = (freq[term] || 0) + 1;
    }
    return freq;
  }

  /**
   * Retrieve relevant knowledge based on user query
   */
  static async retrieve(
    query: string,
    options: {
      topK?: number;
      minScore?: number;
      audience?: string[];
      tags?: string[];
    } = {}
  ): Promise<RetrievalResult[]> {
    await this.initialize();

    const { topK = 3, minScore = 0.1, audience, tags } = options;

    // Calculate relevance scores for all knowledge entries
    const results: RetrievalResult[] = [];

    for (const knowledge of this.knowledgeBase) {
      // Filter by audience if specified
      if (audience && !knowledge.audience.some((a) => audience.includes(a))) {
        continue;
      }

      // Filter by tags if specified
      if (tags && !knowledge.tags.some((t) => tags.includes(t))) {
        continue;
      }

      // Combine searchable text
      const searchText = [
        knowledge.question,
        knowledge.answer_markdown,
        ...knowledge.key_points,
        ...knowledge.tags,
      ].join(' ');

      // Calculate similarity
      const score = this.calculateSimilarity(query, searchText);

      if (score >= minScore) {
        // Find matched terms
        const queryTerms = this.tokenize(query);
        const docTerms = this.tokenize(searchText);
        const matchedTerms = queryTerms.filter((t) => docTerms.includes(t));

        results.push({
          knowledge,
          relevanceScore: score,
          matchedTerms: [...new Set(matchedTerms)],
        });
      }
    }

    // Sort by relevance score (descending) and return top K
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);
  }

  /**
   * Format retrieval results into context for LLM
   */
  static formatContext(results: RetrievalResult[]): string {
    if (results.length === 0) {
      return '';
    }

    let context = '# Relevant Nigerian Compliance Information\n\n';

    for (const result of results) {
      const { knowledge } = result;
      context += `## ${knowledge.question}\n\n`;
      context += `${knowledge.answer_markdown}\n\n`;

      if (knowledge.key_points.length > 0) {
        context += '**Key Points:**\n';
        for (const point of knowledge.key_points) {
          context += `- ${point}\n`;
        }
        context += '\n';
      }

      if (knowledge.compliance_checklist.length > 0) {
        context += '**Compliance Checklist:**\n';
        for (const item of knowledge.compliance_checklist) {
          context += `- [ ] ${item}\n`;
        }
        context += '\n';
      }

      if (knowledge.citations.length > 0) {
        context += '**Sources:**\n';
        for (const citation of knowledge.citations) {
          context += `- [${citation.title}](${citation.url})\n`;
        }
        context += '\n';
      }

      context += '---\n\n';
    }

    return context;
  }

  /**
   * Get knowledge by ID
   */
  static async getKnowledgeById(id: string): Promise<ComplianceKnowledge | null> {
    await this.initialize();
    return this.knowledgeBase.find((k) => k.id === id) || null;
  }

  /**
   * Search knowledge base by tags
   */
  static async searchByTags(tags: string[]): Promise<ComplianceKnowledge[]> {
    await this.initialize();
    return this.knowledgeBase.filter((k) =>
      k.tags.some((t) => tags.includes(t))
    );
  }

  /**
   * Get all available tags
   */
  static async getAllTags(): Promise<string[]> {
    await this.initialize();
    const tagSet = new Set<string>();
    for (const knowledge of this.knowledgeBase) {
      for (const tag of knowledge.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }
}

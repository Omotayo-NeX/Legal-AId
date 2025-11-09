// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  subscription_tier: 'free' | 'basic' | 'premium';
  created_at: string;
  updated_at: string;
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];
    confidence?: number;
  };
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

// Tax Types
export interface TaxCalculationInput {
  gross_income: number;
  type: 'employee' | 'business';
  state?: string;
  deductions?: {
    pension?: number;
    nhf?: number;
    nhis?: number;
    life_insurance?: number;
  };
}

export interface TaxCalculationResult {
  gross_income: number;
  consolidated_relief: number;
  total_deductions: number;
  taxable_income: number;
  tax_breakdown: {
    bracket: string;
    amount: number;
    tax: number;
  }[];
  total_tax: number;
  net_income: number;
}

// Document Types
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'tenancy' | 'employment' | 'business' | 'affidavit' | 'other';
  fields: DocumentField[];
  template_content: string;
}

export interface DocumentField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface GeneratedDocument {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  field_data: Record<string, any>;
  pdf_url: string;
  created_at: string;
}

// Compliance Types
export interface ComplianceReminder {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'tax' | 'cac' | 'pension' | 'custom';
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
  created_at: string;
}

// Knowledge Base Types
export interface LegalKnowledge {
  id: string;
  title: string;
  category: string;
  content: string;
  source: string;
  embedding?: number[];
  created_at: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date?: string;
  payment_reference?: string;
}

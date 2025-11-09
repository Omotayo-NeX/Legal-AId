-- Legal AI.d Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for AI embeddings (optional - for RAG feature)
-- Note: pgvector is available in Supabase by default
CREATE EXTENSION IF NOT EXISTS vector;

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== CHAT SESSIONS TABLE =====
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== DOCUMENT TEMPLATES TABLE =====
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('tenancy', 'employment', 'business', 'affidavit', 'other')),
  fields JSONB NOT NULL,
  template_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== GENERATED DOCUMENTS TABLE =====
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES document_templates(id),
  template_name TEXT NOT NULL,
  field_data JSONB NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== COMPLIANCE REMINDERS TABLE =====
CREATE TABLE IF NOT EXISTS compliance_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('tax', 'cac', 'pension', 'custom')),
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'annually')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== LEGAL KNOWLEDGE BASE TABLE =====
CREATE TABLE IF NOT EXISTS legal_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  embedding vector(1536), -- For OpenAI embeddings (use pgvector extension)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SUBSCRIPTIONS TABLE =====
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

CREATE INDEX idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX idx_generated_documents_created_at ON generated_documents(created_at DESC);

CREATE INDEX idx_compliance_reminders_user_id ON compliance_reminders(user_id);
CREATE INDEX idx_compliance_reminders_due_date ON compliance_reminders(due_date);
CREATE INDEX idx_compliance_reminders_status ON compliance_reminders(status);

CREATE INDEX idx_legal_knowledge_category ON legal_knowledge(category);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- ===== ROW LEVEL SECURITY (RLS) POLICIES =====

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Chat sessions policies
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Generated documents policies
CREATE POLICY "Users can view own documents"
  ON generated_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents"
  ON generated_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON generated_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Compliance reminders policies
CREATE POLICY "Users can view own reminders"
  ON compliance_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders"
  ON compliance_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON compliance_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON compliance_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Document templates are public (read-only)
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view document templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (true);

-- Legal knowledge is public (read-only)
ALTER TABLE legal_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view legal knowledge"
  ON legal_knowledge FOR SELECT
  TO authenticated
  USING (true);

-- ===== STORAGE BUCKET =====
-- Run this in the Supabase Storage section or via SQL:
-- Create storage bucket for PDFs and documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('legal-aid-files', 'legal-aid-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'legal-aid-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'legal-aid-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'legal-aid-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ===== FUNCTIONS & TRIGGERS =====

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== SAMPLE DOCUMENT TEMPLATES =====
-- Insert some default document templates

INSERT INTO document_templates (name, description, category, fields, template_content)
VALUES
(
  'Tenancy Agreement',
  'Standard residential tenancy agreement for Nigerian properties',
  'tenancy',
  '[
    {"name": "landlord_name", "label": "Landlord Full Name", "type": "text", "required": true},
    {"name": "tenant_name", "label": "Tenant Full Name", "type": "text", "required": true},
    {"name": "property_address", "label": "Property Address", "type": "textarea", "required": true},
    {"name": "rent_amount", "label": "Annual Rent Amount", "type": "number", "required": true},
    {"name": "start_date", "label": "Start Date", "type": "date", "required": true},
    {"name": "duration", "label": "Duration (years)", "type": "number", "required": true}
  ]'::jsonb,
  'TENANCY AGREEMENT\n\nThis agreement is made on {start_date} between {landlord_name} (Landlord) and {tenant_name} (Tenant).\n\nProperty: {property_address}\nRent: ₦{rent_amount} per annum\nDuration: {duration} year(s)\n\n[Full template content would go here]'
),
(
  'Non-Disclosure Agreement (NDA)',
  'Mutual non-disclosure agreement for business discussions',
  'business',
  '[
    {"name": "party1_name", "label": "First Party Name", "type": "text", "required": true},
    {"name": "party2_name", "label": "Second Party Name", "type": "text", "required": true},
    {"name": "effective_date", "label": "Effective Date", "type": "date", "required": true},
    {"name": "purpose", "label": "Purpose of Agreement", "type": "textarea", "required": true}
  ]'::jsonb,
  'NON-DISCLOSURE AGREEMENT\n\nEffective Date: {effective_date}\n\nBetween: {party1_name} and {party2_name}\n\nPurpose: {purpose}\n\n[Full NDA template content would go here]'
);

-- ===== COMPLETION MESSAGE =====
DO $$
BEGIN
  RAISE NOTICE 'Legal AI.d database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Copy your Supabase URL and anon key';
  RAISE NOTICE '2. Add them to your .env file';
  RAISE NOTICE '3. Enable email authentication in Supabase Auth settings';
  RAISE NOTICE '4. (Optional) Enable pgvector extension for RAG functionality';
END $$;

# Legal AI.d

**AI-Powered Legal and Tax Assistant for Nigerians**

Legal AI.d is a hybrid mobile application that combines AI-powered legal assistance, tax calculation, document generation, and compliance tracking tailored specifically for Nigerian users.

---

## Features

✅ **AI Legal Assistant** - Chat interface for legal questions in English or Pidgin
✅ **Nigerian Tax Calculator** - PAYE and business tax calculations with deductions
✅ **Document Generator** - Create legal documents (NDA, tenancy agreements, etc.)
✅ **Know Your Rights** - Educational content on Nigerian laws
✅ **Compliance Reminders** - Track tax deadlines, CAC filings, and more
✅ **Secure Authentication** - Email/phone authentication via Supabase

---

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Database + Auth + Storage)
- **AI**: OpenAI GPT-4 or Anthropic Claude
- **Vector DB**: Pinecone or Supabase pgvector (for RAG)
- **Payments**: Paystack (Nigerian gateway)
- **Notifications**: Expo Notifications

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- OpenAI or Anthropic API key (for AI features)

### Installation

1. **Clone or navigate to the project directory**

```bash
cd "/Users/mac/Desktop/legal-AId"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# AI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
# OR
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Pinecone (for RAG)
EXPO_PUBLIC_PINECONE_API_KEY=your_key
EXPO_PUBLIC_PINECONE_ENVIRONMENT=us-east1-gcp
EXPO_PUBLIC_PINECONE_INDEX=legal-aid-knowledge

# Paystack
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

4. **Set up Supabase Database**

- Go to [https://supabase.com](https://supabase.com)
- Create a new project
- Copy your project URL and anon key to `.env`
- Go to SQL Editor in Supabase Dashboard
- Copy and paste the contents of `supabase-schema.sql`
- Run the SQL to create all tables and policies

5. **Enable Supabase Authentication**

- In Supabase Dashboard, go to Authentication > Providers
- Enable Email authentication
- (Optional) Enable Phone authentication with Twilio
- Configure email templates if needed

6. **Start the development server**

```bash
npm start
```

7. **Run on device/emulator**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

---

## Project Structure

```
Legal-AId/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── home.tsx             # Dashboard
│   │   ├── chat.tsx             # AI Chat
│   │   ├── documents.tsx        # Document templates
│   │   └── profile.tsx          # User profile
│   ├── tax-calculator.tsx       # Tax calculator screen
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── services/                # Business logic
│   │   ├── supabase.ts          # Supabase client
│   │   ├── auth.service.ts      # Authentication
│   │   ├── database.service.ts  # Database operations
│   │   └── tax-calculator.service.ts  # Tax calculations
│   ├── store/                   # State management (Zustand)
│   │   └── authStore.ts
│   ├── theme/                   # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   └── types/                   # TypeScript types
│       └── index.ts
├── public/logo/                 # App assets
│   ├── logo.png
│   └── favicon.png
├── supabase-schema.sql          # Database schema
├── .env.example                 # Environment template
├── package.json
└── README.md
```

---

## Features Implementation Status

### ✅ Completed

- [x] Project structure and configuration
- [x] Authentication system (email + phone)
- [x] Database schema and RLS policies
- [x] Core UI screens (onboarding, dashboard, chat, profile)
- [x] Nigerian tax calculator (PAYE with deductions)
- [x] App theming (Navy, Emerald, White)

### 🚧 In Progress / To Be Implemented

- [ ] **AI Chat Integration** - Connect to OpenAI/Claude API with streaming
- [ ] **RAG Pipeline** - Embed Nigerian legal documents for context
- [ ] **Document Generator** - PDF generation from templates
- [ ] **Know Your Rights** - Legal information library
- [ ] **Compliance Reminders** - Push notifications for deadlines
- [ ] **Paystack Integration** - Subscription billing
- [ ] **Chat History** - Save and retrieve conversations

---

## Nigerian Tax Calculator

The tax calculator implements the current Nigerian PAYE (Pay As You Earn) tax rates:

- **7%** on first ₦300,000
- **11%** on next ₦300,000
- **15%** on next ₦500,000
- **19%** on next ₦500,000
- **21%** on next ₦1,600,000
- **24%** on income above ₦3,200,000

### Supported Deductions

- Consolidated Relief Allowance (CRA) - automatically calculated
- Pension contributions (8% of basic)
- National Housing Fund (2.5% of basic)
- NHIS contributions
- Life insurance premiums

---

## Next Steps for AI Integration

### 1. AI Chat Implementation

```typescript
// Example: Integrate OpenAI in chat screen
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: conversationHistory,
  stream: true,
});
```

### 2. RAG Pipeline Setup

1. Collect Nigerian legal documents (Constitution, Acts, tax guides)
2. Chunk documents into manageable pieces
3. Generate embeddings using OpenAI
4. Store in Pinecone or Supabase pgvector
5. Query relevant context before sending to AI

### 3. Document Generation

- Use `@react-pdf/renderer` or `react-native-html-to-pdf`
- Create template system with variable substitution
- Upload PDFs to Supabase Storage
- Store metadata in `generated_documents` table

---

## Deployment

### Build for Production

**iOS:**

```bash
eas build --platform ios
```

**Android:**

```bash
eas build --platform android
```

### App Store Submission

1. Configure app.json with proper bundle identifiers
2. Add required assets (icon, splash screen)
3. Build with EAS (Expo Application Services)
4. Submit to Apple App Store / Google Play Store

---

## Contributing

This is a custom project for a specific client. Contributions should be discussed before implementation.

---

## License

Proprietary - All rights reserved

---

## Support

For questions or issues:
1. Check the Supabase logs for backend errors
2. Review Expo logs for frontend issues
3. Ensure all environment variables are correctly set
4. Verify Supabase RLS policies are enabled

---

## Brand Guidelines

- **Name**: Legal AI.d
- **Colors**:
  - Primary: Emerald Green `#1BAA66`
  - Secondary: Deep Navy `#0C1D2C`
  - Background: Soft White `#F9FBFD`
- **Tone**: Professional, friendly, accessible
- **Target Users**: Nigerian employees, freelancers, small business owners

---

**Built with ⚖️ for Nigerian legal clarity**

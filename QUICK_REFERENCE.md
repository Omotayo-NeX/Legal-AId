# Legal AI.d - Quick Reference Card

## 🚀 Quick Start (First Time)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# 3. Run Supabase schema
# Copy contents of supabase-schema.sql
# Paste in Supabase SQL Editor
# Click Run

# 4. Start the app
npm start
```

---

## 📱 Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm start
# Then press 'i'

# Run on Android emulator
npm start
# Then press 'a'

# Clear cache and restart
npm start -- --clear
```

---

## 🗂️ Project Structure

```
app/
├── (auth)/          → Login, Signup, Welcome
├── (tabs)/          → Home, Chat, Documents, Profile
└── tax-calculator.tsx

src/
├── components/      → Button, Input
├── services/        → Auth, Database, Tax Calculator
├── store/          → Zustand state management
├── theme/          → Colors, Typography
└── types/          → TypeScript definitions
```

---

## 🔑 Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Optional (for full features):
```
EXPO_PUBLIC_OPENAI_API_KEY=sk-xxx
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-xxx
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

---

## 🎨 Brand Assets

**Colors:**
- Primary: `#1BAA66` (Emerald Green)
- Secondary: `#0C1D2C` (Deep Navy)
- Background: `#F9FBFD` (Soft White)

**Logo Location:**
- `public/logo/logo.png`
- `public/logo/favicon.png`

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User profiles and subscription info |
| `chat_sessions` | AI chat conversations |
| `document_templates` | Legal document templates |
| `generated_documents` | User-generated PDFs |
| `compliance_reminders` | Tax/CAC deadline reminders |
| `legal_knowledge` | RAG knowledge base |
| `subscriptions` | Payment/subscription tracking |

---

## 🧪 Test User Flow

1. Start app → See Welcome screen
2. Click "Get Started"
3. Sign up with test credentials
4. Dashboard loads with quick actions
5. Try Tax Calculator:
   - Input: ₦5,000,000
   - See breakdown with Nigerian tax rates
6. Browse document templates
7. View profile

---

## 🐛 Common Issues

### "Invalid API key"
- Check `.env` file exists
- Restart server: `npm start`

### "Auth session missing"
- Verify Supabase credentials in `.env`
- Check Supabase project is active

### RLS Policy Error
- Re-run `supabase-schema.sql`
- Verify policies in Supabase Dashboard

### Metro bundler issues
```bash
# Clear everything
rm -rf node_modules
npm install
npm start -- --clear
```

---

## 📦 Key Dependencies

```json
{
  "expo": "~50.0.0",
  "@supabase/supabase-js": "^2.39.0",
  "react-native": "0.73.2",
  "expo-router": "~3.4.0",
  "zustand": "^4.4.7"
}
```

---

## 🎯 Feature Status

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Tax Calculator | ✅ Complete |
| Dashboard UI | ✅ Complete |
| Chat UI | ✅ Complete (needs API) |
| Documents UI | ✅ Complete (needs PDF gen) |
| Profile | ✅ Complete |
| AI Integration | 🔲 Needs API key |
| PDF Generation | 🔲 Needs implementation |
| Push Notifications | 🔲 Needs setup |
| Payments | 🔲 Needs Paystack |

---

## 🔧 Useful Commands

```bash
# Install new package
npm install package-name

# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Build for production (requires EAS)
eas build --platform ios
eas build --platform android
```

---

## 📝 Adding New Features

### Add a new screen:
```typescript
// 1. Create app/new-screen.tsx
export default function NewScreen() {
  return <View><Text>New Screen</Text></View>;
}

// 2. Navigate to it
router.push('/new-screen');
```

### Add a new database table:
```sql
-- 1. Add to supabase-schema.sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add RLS policies
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data"
  ON new_table FOR SELECT
  USING (auth.uid() = user_id);
```

### Add a new component:
```typescript
// src/components/NewComponent.tsx
import { View, Text } from 'react-native';
import { colors, typography } from '@/theme';

export const NewComponent = () => {
  return <View><Text>Component</Text></View>;
};
```

---

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev

---

## 🎓 Code Examples

### Call an API:
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data }),
});
```

### Access Supabase:
```typescript
import { supabase } from '@/services/supabase';

const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', userId);
```

### Use theme:
```typescript
import { colors, typography } from '@/theme';

const styles = StyleSheet.create({
  text: {
    ...typography.h3,
    color: colors.primary,
  },
});
```

---

## ⚡ Pro Tips

1. **Use Expo Go app** for faster testing (no build needed)
2. **Enable hot reload** - saves changes without refresh
3. **Check Supabase logs** when debugging database issues
4. **Use TypeScript** - catches errors before runtime
5. **Test on real device** - simulators don't show all issues

---

**Last Updated:** November 2025
**Version:** 1.0.0 MVP

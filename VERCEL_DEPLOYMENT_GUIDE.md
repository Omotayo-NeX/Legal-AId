# Vercel Deployment Guide for Legal-AId

## Overview
This guide will help you deploy the web version of your Legal-AId Expo app to Vercel.

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All required API keys and environment variables

## Preparation Complete
The following files have been added to your project:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `package.json` - Updated with `vercel-build` script

## Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your Legal-AId repository
4. Click "Import"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In the Vercel dashboard, go to your project settings → Environment Variables and add:

#### Required Environment Variables:

**Supabase Configuration**
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**AI Configuration** (Choose one or both)
```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Vector Database (Pinecone)**
```
EXPO_PUBLIC_PINECONE_API_KEY=your_pinecone_api_key_here
EXPO_PUBLIC_PINECONE_ENVIRONMENT=your_pinecone_environment_here
EXPO_PUBLIC_PINECONE_INDEX=legal-aid-knowledge
```

**Payment Gateway (Paystack)**
```
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```

**App Configuration**
```
EXPO_PUBLIC_API_URL=https://your-production-api-url.com
```

**Important Notes:**
- Make sure to use `Production` environment for all variables
- All environment variables prefixed with `EXPO_PUBLIC_` will be available in the web build
- Never commit your actual `.env` file to Git

### 4. Build Settings

Vercel should automatically detect these settings, but verify:
- **Framework Preset:** Other
- **Build Command:** `npm run vercel-build` or `expo export:web`
- **Output Directory:** `web-build`
- **Install Command:** `npm install`

### 5. Deploy

Click "Deploy" and wait for the build to complete. Vercel will:
1. Install dependencies
2. Run `expo export:web` to build the web version
3. Deploy the `web-build` directory

### 6. Access Your Deployed App

After deployment completes, Vercel will provide you with:
- Production URL: `https://your-project-name.vercel.app`
- Deployment logs and analytics

## Important Considerations

### Mobile-Specific Features
Some React Native features may not work on web:
- Native modules (Camera, Biometrics, etc.)
- Platform-specific UI components
- Some third-party libraries

Test thoroughly on web to ensure core functionality works.

### API URLs
Update your `EXPO_PUBLIC_API_URL` to point to your production backend API.

### Continuous Deployment
Vercel automatically redeploys when you push to your main branch.

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify environment variables are set correctly

### Features Not Working
- Check browser console for errors
- Verify API endpoints are accessible from web
- Check CORS settings on your backend

### Performance Issues
- Consider code splitting for large apps
- Optimize images and assets
- Use Vercel Analytics to monitor performance

## Local Testing

Before deploying, test the web build locally:
```bash
npm run vercel-build
npx serve web-build
```

Visit `http://localhost:3000` to test the production build.

## Next Steps

1. Set up your backend API (if not already done)
2. Configure Supabase for production
3. Test all features on the deployed web version
4. Set up monitoring and error tracking
5. Configure custom domain (optional)

## Support

- Vercel Documentation: https://vercel.com/docs
- Expo Web Documentation: https://docs.expo.dev/workflow/web/
- Issues: Check your project's GitHub issues

---

**Note:** This deployment is for the web version only. For iOS/Android deployment, use Expo EAS Build or traditional app store deployment methods.

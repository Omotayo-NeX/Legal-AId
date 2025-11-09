module.exports = {
  expo: {
    name: "Legal AI.d",
    slug: "legal-aid",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0C1D2C"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.legalaid.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0C1D2C"
      },
      package: "com.legalaid.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "legalaid",
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#1BAA66"
        }
      ],
      "expo-font"
    ],
    extra: {
      EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_ANTHROPIC_API_KEY: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
      EXPO_PUBLIC_PINECONE_API_KEY: process.env.EXPO_PUBLIC_PINECONE_API_KEY,
      EXPO_PUBLIC_PINECONE_ENVIRONMENT: process.env.EXPO_PUBLIC_PINECONE_ENVIRONMENT,
      EXPO_PUBLIC_PINECONE_INDEX: process.env.EXPO_PUBLIC_PINECONE_INDEX,
      EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    }
  }
};

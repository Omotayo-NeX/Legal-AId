# Troubleshooting Guide - Legal AI.d

## Error: "EMFILE: too many open files"

This is a common macOS issue where the file watcher limit is reached.

### Solution:

**Open a NEW Terminal window** and run these commands:

```bash
# Navigate to project
cd "/Users/mac/Desktop/Legal AId"

# Use the startup script (recommended)
./start-app.sh
```

**OR manually:**

```bash
# Set file limit and start in one command
ulimit -n 10000 && npx expo start
```

---

## Alternative: Use Expo Go App (Simplest Method)

If the local server doesn't work, you can use Expo's cloud service:

1. Install **Expo Go** app on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Create free Expo account: https://expo.dev/signup

3. Login to Expo CLI:
   ```bash
   npx expo login
   ```

4. Start with Expo service:
   ```bash
   npx expo start --tunnel
   ```

5. Scan QR code with Expo Go app

---

## Package Version Warnings

If you see warnings about package versions, you can ignore them for now. The app will still work.

To fix them (optional):

```bash
npm install @react-native-async-storage/async-storage@1.21.0
npm install react-native@0.73.6
```

---

## Clear Cache Issues

If the app behaves strangely:

```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

---

## Port Already in Use

If you get "port 8081 already in use":

```bash
# Find and kill the process
lsof -ti:8081 | xargs kill -9

# Then start again
./start-app.sh
```

---

## Database Connection Issues

If you see "Invalid API key" or "Auth session missing":

1. Check `.env` file exists in project root
2. Verify Supabase credentials are correct:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://ftwnuzkawwzbaebysdpk.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart the server

---

## Still Having Issues?

Try running in web mode (works without iOS/Android setup):

```bash
npx expo start --web
```

This will open the app in your web browser for testing.

---

## Getting Help

1. Check Expo logs in terminal for specific errors
2. Check browser console (F12) if using web mode
3. Check Supabase dashboard logs for backend errors

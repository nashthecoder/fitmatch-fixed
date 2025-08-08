# Production Environment Setup

## 🔥 **CRITICAL: Firebase Production Configuration**

### **Current Issues:**
1. Using development Firebase config in production
2. No environment separation
3. API keys potentially exposed

### **IMMEDIATE STEPS:**

#### **1. Create Production Firebase Project**
```bash
# In Firebase Console:
1. Create new project: "fitmatch-production"
2. Enable Authentication (Google, Email/Password)
3. Create Firestore database
4. Enable Storage
5. Get production config keys
```

#### **2. Environment Variables Setup**
Create `.env.production`:
```bash
# Production Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fitmatch-production.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fitmatch-production
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=fitmatch-production.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_prod_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_prod_measurement_id

# App Environment
NODE_ENV=production
EXPO_PUBLIC_APP_ENV=production
```

#### **3. Update Firebase Config**
```typescript
// config/firebase.js - Add environment detection
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate required config
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing Firebase config: ${missingKeys.join(', ')}`);
}
```

## 📊 **COST OPTIMIZATION SETUP**

### **Firestore Usage Limits**
```javascript
// Add to Firebase Console → Quotas
{
  "dailyReads": 50000,    // Adjust based on user count
  "dailyWrites": 20000,   // Adjust based on activity
  "dailyDeletes": 5000    // For cleanup operations
}
```

### **Storage Limits**
```javascript
// Add storage quotas
{
  "totalStorage": "5GB",     // User media storage
  "dailyUploads": "1GB",     // Daily upload limit
  "maxFileSize": "50MB"      // Per-file limit
}
```

## 🔒 **SECURITY HARDENING**

### **API Key Restrictions**
```bash
# In Google Cloud Console:
1. Go to Credentials
2. Edit API keys
3. Add Application restrictions:
   - Web: Add your domain(s)
   - Android: Add package name & SHA-1
   - iOS: Add bundle ID
4. Add API restrictions:
   - Enable only needed APIs
```

### **Firebase App Check**
```typescript
// Add to firebase config for production
import { getAppCheck, initializeAppCheck } from 'firebase/app-check';

if (process.env.NODE_ENV === 'production') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
    isTokenAutoRefreshEnabled: true
  });
}
```

## 🚨 **IMMEDIATE PRODUCTION BLOCKERS**

### **Before any public launch:**

1. **Deploy firestore.rules** ⚠️ 
2. **Create production Firebase project** ⚠️
3. **Environment variable separation** ⚠️  
4. **API key restrictions** ⚠️
5. **Enable App Check** ⚠️
6. **Set up monitoring/alerts** ⚠️
7. **Add crash reporting** ⚠️
8. **Test with production data** ⚠️

### **Data Migration Plan:**

```bash
# If you have existing users:
1. Export user data from dev Firebase
2. Clean/validate data structure  
3. Import to production Firebase
4. Update user notification about migration
5. Test all functionality
6. Switch app to production config
```

# 📱 FitMatch Production Deployment Guide
# APK & API Infrastructure Setup

## 🎯 **PRODUCTION DEPLOYMENT PRIORITIES**

Since web is only for development, focus on:
1. **APK Production Build** - Android Play Store deployment
2. **API Infrastructure** - Firebase backend optimization
3. **Production Environment** - Separate from development

---

## 🚨 **CRITICAL SECURITY: COMPLETED ✅**

### ✅ Firestore Security Rules - DEPLOYED
- **Status**: Successfully deployed to `fit-match-6930a`
- **Security**: Database is now protected with proper access controls
- **Next**: Monitor Firebase Console for any permission errors

### ✅ Storage Security Rules - DEPLOYED  
- **Status**: Storage rules updated and deployed
- **Security**: File uploads now properly secured

---

## 📱 **APK PRODUCTION BUILD SETUP**

### **1. Android Production Configuration**

#### **Update app.json for Production**
```json
{
  "expo": {
    "name": "FitMatch",
    "slug": "fitmatch",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f0e0c"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nashthecoder.fitmatch",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.nashthecoder.fitmatch",
      "versionCode": 1,
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f0e0c"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your fitness partners.",
          "cameraPermission": "The app accesses your camera to let you take photos for your fitness profile."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow FitMatch to use your location to find nearby fitness partners."
        }
      ],
      "@react-native-google-signin/google-signin"
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-eas-project-id-here"
      }
    }
  }
}
```

#### **EAS Build Configuration**
```json
// eas.json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

### **2. Production Environment Setup**

#### **Environment Variables for Production**
```bash
# .env.production
NODE_ENV=production
EXPO_PUBLIC_APP_ENV=production

# Production Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=your_production_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fit-match-production.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fit-match-production
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=fit-match-production.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_production_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_production_measurement_id

# Google Services
EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID=your_production_google_client_id
```

### **3. Build Commands**

#### **Development APK**
```bash
# Build development APK
eas build --platform android --profile development

# Build preview APK (for testing)
eas build --platform android --profile preview
```

#### **Production Build**
```bash
# Build production AAB for Play Store
eas build --platform android --profile production

# Build production APK (if needed)
eas build --platform android --profile production --clear-cache
```

---

## 🔥 **API PRODUCTION OPTIMIZATION**

### **1. Firebase Production Setup**

#### **Create Production Firebase Project**
```bash
# In Firebase Console:
# 1. Create new project: "fit-match-production"
# 2. Enable Authentication (Google, Email/Password)
# 3. Create Firestore database in production mode
# 4. Enable Storage
# 5. Copy production config keys to .env.production
```

#### **Production Firestore Indexes**
```javascript
// Add these composite indexes in Firebase Console → Firestore → Indexes:

// User discovery/matching
users: [personalData, isActive, ville]
users: [sportsChoices, ville]  
users: [category, ville]

// Social features
posts: [createdAt DESC]
posts: [posterInfo.uid, createdAt DESC]
likes: [to, createdAt DESC]
likes: [from, to]

// Chat functionality  
chats: [participants, lastMessage.createdAt DESC]
notifications: [to, read, createdAt DESC]

// Partner features
events: [partenaireId, date]
ads: [partenaire, createdAt DESC]
```

#### **Firestore Quotas & Limits**
```javascript
// Set in Firebase Console → Firestore → Quotas
{
  "dailyReads": 100000,     // Adjust based on user count
  "dailyWrites": 50000,     // Adjust based on activity  
  "dailyDeletes": 10000,    // For cleanup operations
  "maxConnections": 1000    // Concurrent connections
}
```

### **2. Performance Optimization**

#### **Data Migration Strategy**
```typescript
// scripts/migrateToProduction.ts
import { db as devDb } from './config/firebase';
import { db as prodDb } from './config/firebaseProduction';

export const migrateToProduction = async () => {
  console.log('🔄 Starting production migration...');
  
  // 1. Export user data from development
  const users = await getDocs(collection(devDb, 'users'));
  
  // 2. Clean and validate data
  const cleanedUsers = users.docs.map(doc => ({
    ...doc.data(),
    migratedAt: new Date(),
    environment: 'production'
  }));
  
  // 3. Import to production with proper structure
  for (const userData of cleanedUsers) {
    await setDoc(doc(prodDb, 'users', userData.uid), userData);
  }
  
  console.log('✅ Production migration completed');
};
```

---

## 🚀 **DEPLOYMENT TIMELINE**

### **Week 1: Core Infrastructure**
- [x] Deploy Firestore security rules (COMPLETED)
- [x] Deploy Storage security rules (COMPLETED) 
- [ ] Create production Firebase project
- [ ] Set up environment separation
- [ ] Configure EAS Build

### **Week 2: APK Production**
- [ ] Build and test preview APK
- [ ] Set up Google Play Console
- [ ] Create app store assets (screenshots, descriptions)
- [ ] Test production APK thoroughly
- [ ] Submit for internal testing

### **Week 3: Launch Preparation**  
- [ ] Monitor Firebase usage and costs
- [ ] Set up crash reporting and analytics
- [ ] Performance testing at scale
- [ ] Prepare rollback plan
- [ ] Go live with production APK

---

## 📊 **MONITORING & MAINTENANCE**

### **Firebase Monitoring**
```bash
# Monitor usage in Firebase Console:
# 1. Firestore usage and costs
# 2. Authentication metrics  
# 3. Storage bandwidth
# 4. Function invocations (if used)
# 5. Crashlytics reports
```

### **Performance Metrics**
- **App startup time**: < 3 seconds
- **Screen transition time**: < 500ms
- **Image loading**: < 2 seconds
- **Chat message latency**: < 1 second
- **Crash rate**: < 0.1%

### **Cost Optimization**
```javascript
// Implement data retention policies
// Auto-delete old stories (24h)
// Compress images before upload
// Pagination for large collections
// Efficient query patterns
```

---

## 🎯 **IMMEDIATE NEXT STEPS**

1. **Create production Firebase project** (30 min)
2. **Update environment variables** (15 min)  
3. **Test with production config** (1 hour)
4. **Build preview APK** (30 min)
5. **Set up Google Play Console** (1 hour)

Your database is now secure! 🔒 Let's focus on production APK next.

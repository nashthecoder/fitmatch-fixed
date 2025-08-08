# FitMatch Firebase Data Architecture Guide

## 🏗️ **PRODUCTION DATA STRUCTURE**

### **Required Collection Standardization:**

#### **1. Rename Collections (CRITICAL)**
```bash
# In Firebase Console, you need to:
1. Create new lowercase collections
2. Migrate data from old collections
3. Update all references in code
4. Delete old collections

OLD → NEW:
"Evenements" → "events"
"Ads" → "ads"
```

#### **2. Optimized Collection Schema**

### **📁 USERS Collection** (`users/{userId}`)
```typescript
interface UserDocument {
  // Core Identity
  uid: string;
  email: string;
  nom: string;
  prenoms: string;
  pseudo?: string;
  
  // Profile Data
  profilePicUrl?: string;
  coverPicUrl?: string;
  bio?: string;
  naissance: Timestamp;
  ville: string;
  nationalite: string;
  sex: 0 | 1; // 0=male, 1=female
  
  // App State
  personalData: boolean; // Privacy setting
  acceptCGU: boolean;
  quizCompleted: boolean;
  userType: "binome" | "partner";
  isActive: boolean;
  lastSeen: Timestamp;
  
  // User Journey Data
  weekendVibes?: string[];
  personalityTraits?: string[];
  personality?: string;
  sportsChoices?: string[];
  dietChoices?: string[];
  diet?: string;
  sportsObjectives?: string[];
  objectifDuCoeur?: string;
  sportExtreme?: string;
  
  // Calculated Scores
  frequence?: number;
  totalPoints?: number;
  category?: string;
  percentage?: number;
  
  // Social Data
  likes?: string[]; // Array of user IDs this user liked
  verified?: boolean;
  
  // Media
  mesPhotos?: MediaItem[];
  mesVideos?: MediaItem[];
  videoChallenge?: {
    videoUri: string;
    thumbnailUri: string;
    uploadedAt: Timestamp;
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface MediaItem {
  uri: string;
  type: "photo" | "video";
  uploadedAt: Timestamp;
  thumbnailUri?: string; // For videos
}
```

### **🏢 PARTNERS Collection** (`partenaires/{partnerId}`)
```typescript
interface PartnerDocument {
  // Core Identity
  uid: string;
  email: string;
  titre: string;
  description: string;
  
  // Business Info
  category: string;
  website?: string;
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  
  // Location
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  
  // Media
  images: string[];
  videos: string[];
  imageUrl?: string; // Primary image
  
  // App State
  isValid: boolean;
  acceptCGU: boolean;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **📱 POSTS Collection** (`posts/{postId}`)
```typescript
interface PostDocument {
  id: string;
  
  // Content
  text: string;
  mediaUrl?: string;
  mediaType?: "photo" | "video";
  thumbnailUrl?: string; // For videos
  
  // Author Info (denormalized for performance)
  posterInfo: {
    uid: string;
    username: string;
    profilePicUrl?: string;
    verified?: boolean;
  };
  
  // Engagement Metrics
  likes: {
    count: number;
    by: string[]; // User IDs who liked
  };
  comments: {
    count: number;
  };
  shares: {
    count: number;
    by: string[];
  };
  
  // Tagging
  taggedUsers: string[];
  taggedEventId?: string;
  taggedPlaceName?: string;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### **📖 STORIES Collection** (`stories/{storyId}`)
```typescript
interface StoryDocument {
  id: string;
  
  // Content
  mediaUrl: string;
  mediaType: "photo" | "video";
  
  // Author Info
  posterInfo: {
    uid: string;
    nom: string;
    prenoms: string;
    profilePicUrl: string;
  };
  
  // Expiration
  expiredOn: Timestamp; // Auto-delete after 24h
  
  // Timestamps
  createdAt: Timestamp;
}
```

### **💬 CHATS Collection** (`chats/{chatId}`)
```typescript
interface ChatDocument {
  id: string; // Format: "{userId1}_{userId2}" (sorted alphabetically)
  participants: string[]; // [userId1, userId2]
  
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: Timestamp;
    read: boolean;
  };
  
  // For UI display (denormalized)
  otherUserName?: string;
  otherUserPhoto?: string;
}

// Subcollection: chats/{chatId}/messages/{messageId}
interface MessageDocument {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
  read: boolean;
  mediaUrl?: string;
}
```

### **❤️ LIKES Collection** (`likes/{likeId}`)
```typescript
interface LikeDocument {
  from: string; // User who sent the like
  to: string;   // User who received the like
  createdAt: Timestamp;
  matched: boolean; // Set to true when reciprocal like found
}
```

### **⭐ SUPERLIKES Collection** (`superlikes/{likeId}`)
```typescript
interface SuperLikeDocument {
  from: string;
  to: string;
  createdAt: Timestamp;
  matched: boolean;
}
```

### **🔥 MATCHES Collection** (`matches/{matchId}`)
```typescript
interface MatchDocument {
  users: string[]; // [userId1, userId2] (sorted)
  userIds: {
    [userId: string]: boolean; // For efficient queries
  };
  createdAt: Timestamp;
}
```

### **🔔 NOTIFICATIONS Collection** (`notifications/{notificationId}`)
```typescript
interface NotificationDocument {
  from: string; // User who triggered the notification
  to: string;   // User who receives the notification
  type: "like" | "superlike" | "match" | "request" | "message";
  read: boolean;
  createdAt: Timestamp;
  
  // Optional metadata
  postId?: string; // If notification is about a post
  messageText?: string; // For message requests
}
```

### **📩 MESSAGE_REQUESTS Collection** (`messageRequests/{requestId}`)
```typescript
interface MessageRequestDocument {
  from: string;
  to: string;
  message: string;
  accepted: boolean;
  createdAt: Timestamp;
}
```

### **🎉 EVENTS Collection** (`events/{eventId}`) 
```typescript
interface EventDocument {
  // Event Info
  titre: string;
  description: string;
  date: Timestamp;
  emplacement: string; // Location name
  location?: {
    latitude: number;
    longitude: number;
  };
  
  // Media
  imageUrls?: string[];
  
  // Creator
  partenaireId: string; // Partner who created the event
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **📢 ADS Collection** (`ads/{adId}`)
```typescript
interface AdDocument {
  // Ad Content
  titre: string;
  description?: string;
  image_url: string;
  
  // Distribution
  location: string; // Distribution method/location
  
  // Creator
  partenaire: string; // Partner ID who created the ad
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔧 **MIGRATION STRATEGY**

### **Phase 1: Immediate Security (Day 1)**
1. Deploy `firestore.rules` to Firebase Console
2. Test all app functions with new security rules
3. Fix any permission errors

### **Phase 2: Collection Renaming (Day 2-3)**
1. Create migration scripts to rename collections
2. Update all code references
3. Test thoroughly before deleting old collections

### **Phase 3: Data Optimization (Week 1)**
1. Add missing indexes for common queries
2. Implement data validation functions
3. Add automated cleanup for expired stories

### **Phase 4: Performance Monitoring (Week 2)**
1. Monitor Firestore usage and costs
2. Optimize queries with heavy read patterns
3. Implement caching strategies where needed

## 🚨 **CRITICAL PRODUCTION ISSUES TO FIX**

1. **No Firestore Security Rules** - SECURITY VULNERABILITY
2. **Inconsistent Collection Naming** - MAINTAINABILITY ISSUE  
3. **Missing Data Validation** - DATA INTEGRITY ISSUE
4. **No Automated Cleanup** - STORAGE COST ISSUE
5. **Inefficient Queries** - PERFORMANCE ISSUE

## 📊 **RECOMMENDED FIRESTORE INDEXES**

```javascript
// Add these composite indexes in Firebase Console:

// For user discovery/matching
users: [personalData, isActive, ville]
users: [sportsChoices, ville]
users: [category, ville]

// For social features
posts: [createdAt DESC]
posts: [posterInfo.uid, createdAt DESC]
likes: [to, createdAt DESC]
likes: [from, to]

// For chat functionality
chats: [participants, lastMessage.createdAt DESC]
notifications: [to, read, createdAt DESC]

// For partner features
events: [partenaireId, date]
ads: [partenaire, createdAt DESC]
```

# Development Guide

This comprehensive guide provides everything developers need to know to work effectively on the FitMatch project, from initial setup to advanced development workflows.

## 🚀 Quick Start

### Prerequisites Checklist

Before starting, ensure you have the following installed:

```bash
# Node.js (version 18.0.0+)
node --version  # Should show v18.x.x or higher

# npm (comes with Node.js)
npm --version   # Should show 8.x.x or higher

# Git for version control
git --version

# iOS development (macOS only)
xcode-select --install  # Xcode command line tools

# Android development (optional but recommended)
# Download Android Studio: https://developer.android.com/studio
```

### Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/nashthecoder/fitmatch-fixed.git
cd fitmatch-fixed

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment configuration
cp .env.example .env
# Edit .env with your Firebase configuration

# 4. Start the development server
npm start
```

### Firebase Configuration

**Required Files** (get from Firebase Console):
```bash
# Place these files in the project root:
google-services.json      # Android configuration
GoogleService-Info.plist # iOS configuration
```

**Environment Variables** (add to `.env`):
```bash
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🏗 Project Structure

### Directory Organization

```
fitmatch-fixed/
├── app/                          # Expo Router screens
│   ├── (root)/                  # Main app (tab navigation)
│   │   ├── Home/               # Home feed and posts
│   │   ├── MessageScreen/      # Chat and messaging
│   │   ├── Profile/            # User profile
│   │   └── Events/             # Event management
│   ├── Auth/                   # Authentication screens
│   ├── Users/                  # User management
│   ├── Partner/                # Partner/brand screens
│   └── _layout.tsx            # Root layout with providers
├── components/                  # Reusable UI components
│   ├── shared/                 # Common components
│   ├── Posts/                  # Social media components
│   └── Stories/                # Stories feature
├── store/                      # Redux state management
│   ├── slices/                 # Redux Toolkit slices
│   ├── store.ts               # Store configuration
│   └── rootReducer.ts         # Combined reducers
├── customHooks/                # Custom React hooks
├── helpers/                    # Utility functions
├── config/                     # App configuration
├── assets/                     # Images, fonts, animations
├── wiki/                       # Project documentation
└── types/                      # TypeScript type definitions
```

### Import Path Mapping

The project uses TypeScript path mapping for clean imports:

```typescript
// Instead of relative imports:
import { UserData } from '../../../store/slices/userSlice';

// Use absolute imports:
import { UserData } from '@/store/slices/userSlice';
```

**Configured paths** (in `tsconfig.json`):
- `@/*` → Root directory
- `@/components/*` → Components directory
- `@/store/*` → Store directory
- `@/helpers/*` → Helpers directory

## 🛠 Development Workflow

### Available npm Scripts

```bash
# Development
npm start           # Start Expo development server
npm run dev         # Start with dev client
npm run android     # Run on Android device/emulator
npm run ios         # Run on iOS device/simulator
npm run web         # Run web version

# Code Quality
npm run lint        # Check code quality issues
npm run lint:fix    # Auto-fix linting issues
npm run type-check  # TypeScript compilation check

# Build & Deploy
npm run build       # Create production build
npm run clean       # Clean dependencies and cache
```

### Development Server Options

When you run `npm start`, you'll see options:

```bash
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open Expo Go
```

### Hot Reloading

- **Fast Refresh**: Automatic component updates without losing state
- **Full Reload**: Press `r` in terminal to fully reload the app
- **Clear Cache**: Use `npm start --clear` if you encounter issues

## 🔧 Technology Stack & Tools

### Core Technologies

**Frontend Framework:**
```json
{
  "react-native": "0.79.5",
  "expo": "53.0.20",
  "typescript": "~5.8.3"
}
```

**State Management:**
```json
{
  "@reduxjs/toolkit": "^2.8.2",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0",
  "@tanstack/react-query": "^5.83.0"
}
```

**Navigation & UI:**
```json
{
  "expo-router": "^3.5.24",
  "nativewind": "^4.1.23",
  "react-native-reanimated": "~3.17.4"
}
```

**Backend Services:**
```json
{
  "firebase": "^11.10.0",
  "@react-native-firebase/app": "^22.4.0",
  "@react-native-firebase/auth": "^22.4.0",
  "@react-native-firebase/firestore": "^22.4.0"
}
```

### IDE Configuration

**VS Code Extensions** (recommended):
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native",
    "expo.vscode-expo-tools",
    "dbaeumer.vscode-eslint"
  ]
}
```

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📝 Coding Standards

### TypeScript Guidelines

**Interface Naming:**
```typescript
// Use PascalCase for interfaces
interface UserData {
  id: string;
  name: string;
}

// Use Props suffix for component props
interface PostCardProps {
  post: PostData;
  onLike: () => void;
}
```

**Type Definitions:**
```typescript
// Define types for all function parameters and returns
const fetchUserData = async (userId: string): Promise<UserData | null> => {
  // Implementation
};

// Use union types for specific values
type UserType = 'binome' | 'partner';
type Theme = 'light' | 'dark' | 'system';
```

### Component Guidelines

**Functional Components:**
```typescript
// Use React.FC for component typing (optional)
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      className={`px-4 py-2 rounded-lg ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`}
      onPress={onPress}
    >
      <Text className="text-white font-medium">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
```

**Hooks Usage:**
```typescript
// Custom hooks start with 'use'
const useUserData = (userId: string) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data
  }, [userId]);
  
  return { userData, loading };
};

// Use useCallback for event handlers in lists
const renderPost = useCallback((item: PostData) => {
  return <PostCard post={item} onLike={() => handleLike(item.id)} />;
}, [handleLike]);
```

### Styling Guidelines

**NativeWind/TailwindCSS:**
```typescript
// Use semantic class names
<View className="bg-white rounded-lg shadow-md p-4 mb-4">
  <Text className="text-lg font-bold text-gray-800 mb-2">
    Title
  </Text>
  <Text className="text-gray-600 leading-5">
    Description text
  </Text>
</View>

// Use conditional styling
<Text className={`text-base ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
  Status
</Text>
```

## 🔥 Firebase Integration

### Authentication

```typescript
// Email authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### Firestore Database

```typescript
// Type-safe Firestore operations
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

const createUser = async (userData: UserData): Promise<void> => {
  const userRef = doc(db, 'users', userData.uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

const getUserData = async (userId: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  return docSnap.exists() ? docSnap.data() as UserData : null;
};
```

### Storage

```typescript
// Upload images/videos
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebaseConfig';

const uploadImage = async (uri: string, path: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  
  return getDownloadURL(storageRef);
};
```

## 🧪 Testing Guidelines

### Unit Testing Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
```

**Component Testing:**
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/shared/Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
  
  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

**Hook Testing:**
```typescript
// __tests__/hooks/useEmailAuth.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useEmailAuth } from '@/customHooks/useEmailAuth';

describe('useEmailAuth', () => {
  it('should handle sign in correctly', async () => {
    const { result } = renderHook(() => useEmailAuth());
    
    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'password');
      expect(response.success).toBe(true);
    });
  });
});
```

## 🐛 Debugging

### React Native Debugger

```bash
# Install React Native Debugger
# Download from: https://github.com/jhen0409/react-native-debugger

# Enable debugging in app
# Shake device → "Debug" → "Debug JS Remotely"
```

### Flipper Integration

```bash
# Install Flipper
# Download from: https://fbflipper.com/

# Useful Flipper plugins:
# - Network inspector
# - Redux DevTools
# - Layout inspector
# - Logs viewer
```

### Console Debugging

```typescript
// Use structured logging
console.log('🔥 User data:', userData);
console.error('❌ Authentication failed:', error);
console.warn('⚠️ Deprecated function used');

// Remove console logs in production
if (__DEV__) {
  console.log('Development only log');
}
```

## 🚀 Build & Deployment

### Development Builds

```bash
# Create development build
npx eas build --profile development --platform all

# Install on device
npx eas build:run -p android
npx eas build:run -p ios
```

### Production Builds

```bash
# Create production builds
npx eas build --profile production --platform all

# Submit to app stores
npx eas submit --platform ios
npx eas submit --platform android
```

### Environment Configuration

**EAS Build Profiles** (`eas.json`):
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "NODE_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🔄 Git Workflow

### Branch Naming

```bash
# Feature branches
feature/user-authentication
feature/post-creation
feature/event-management

# Bug fix branches
fix/login-validation
fix/image-upload-error

# Hotfix branches
hotfix/critical-crash-fix
```

### Commit Messages

```bash
# Use conventional commits
feat: add user profile editing functionality
fix: resolve chat message ordering issue
docs: update API documentation
style: improve button component styling
refactor: optimize image loading performance
test: add unit tests for authentication
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing done

## Screenshots/Videos
(If UI changes)
```

## 📚 Learning Resources

### React Native
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

### State Management
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)

### Firebase
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)

## 🆘 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
# Clear cache and restart
npx expo start --clear
# or
rm -rf node_modules && npm install
```

**TypeScript errors:**
```bash
# Check TypeScript configuration
npm run type-check

# Restart TypeScript service in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Firebase connection issues:**
```bash
# Verify configuration files are in place
ls -la google-services.json GoogleService-Info.plist

# Check environment variables
cat .env
```

**Build failures:**
```bash
# Clean EAS build cache
npx eas build --clear-cache

# Check EAS build logs
npx eas build:list
```

### Getting Help

1. **Check the wiki** - Most questions are answered in project documentation
2. **Search existing issues** - GitHub issues for common problems
3. **Ask the team** - Reach out to senior developers
4. **Community resources** - Expo/React Native Discord communities

---

This development guide should provide everything needed to work effectively on the FitMatch project. Keep it updated as the project evolves!
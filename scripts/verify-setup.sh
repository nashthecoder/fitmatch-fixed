#!/bin/bash

echo "🔍 FitMatch Setup Verification Script"
echo "======================================"

# Check Node.js version
echo "📦 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
    if [[ $NODE_VERSION =~ v([0-9]+) ]] && [ "${BASH_REMATCH[1]}" -ge 18 ]; then
        echo "✅ Node.js version is compatible (18+)"
    else
        echo "❌ Node.js version must be 18 or higher"
        exit 1
    fi
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm version
echo "📦 Checking npm version..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: v$NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if we're in the right directory
echo "📁 Checking project structure..."
if [ -f "package.json" ] && [ -f "app.json" ]; then
    echo "✅ In FitMatch project directory"
else
    echo "❌ Not in FitMatch project directory. Run this from the project root."
    exit 1
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

# Check required files
echo "📄 Checking configuration files..."
files=("tailwind.config.js" "metro.config.js" "babel.config.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check custom hooks
echo "🪝 Checking custom hooks..."
hooks=("useIsKeyboardVisible.ts" "useEmailAuth.ts" "useGoogleSignIn.ts" "useUserList.ts" "useHandleFormChange copy.ts")
for hook in "${hooks[@]}"; do
    if [ -f "customHooks/$hook" ]; then
        echo "✅ customHooks/$hook exists"
    else
        echo "❌ customHooks/$hook missing"
    fi
done

# Check key dependencies
echo "📦 Checking key dependencies..."
if npm ls expo-image-picker expo-video-thumbnails react-native-video expo-network react-native-web &> /dev/null; then
    echo "✅ All key dependencies installed"
else
    echo "⚠️  Some dependencies might be missing. Check with: npm ls"
fi

echo ""
echo "🎉 Setup verification complete!"
echo "If all checks passed, you can start the development server with:"
echo "   npx expo start"
# FitMatch 💪

**"Moins de swipe, plus de résultats"** - Une application sociale de fitness révolutionnaire qui connecte les passionnés de sport pour s'entraîner ensemble.

FitMatch est une application mobile cross-platform qui combine les aspects sociaux des applications de rencontre avec le monde du fitness, permettant aux utilisateurs de trouver leur binôme d'entraînement idéal et de rejoindre une communauté active.

## 🎯 Vue d'ensemble

FitMatch transforme la recherche d'un partenaire d'entraînement en une expérience moderne et engageante. L'application propose un système de matching basé sur les préférences fitness, la localisation et les objectifs sportifs, enrichi par des fonctionnalités sociales avancées.

### Fonctionnalités principales

🏋️ **Matching Fitness**
- Système de swipe pour découvrir des partenaires d'entraînement
- Algorithme de matching basé sur la localisation, les préférences et les objectifs
- Profils détaillés avec photos, vidéos et informations fitness

💬 **Réseau Social Fitness**
- Fil d'actualité avec posts et stories de la communauté
- Chat direct entre utilisateurs matchés
- Système de likes, commentaires et partages

📅 **Organisation d'Événements**
- Création et gestion d'événements sportifs
- Événements publics et privés
- Système d'inscription et de notification

🏪 **Partenariats & Marques**
- Profils spéciaux pour les marques et partenaires fitness
- Contenu sponsorisé intégré
- Opportunités de collaboration

## 🚀 Parcours Utilisateur

### 1. Découverte et Inscription
- **Landing Page**: Introduction avec le slogan "Moins de swipe, plus de résultats"
- **Choix du profil**: Utilisateur standard ou marque partenaire
- **Inscription**: Email/mot de passe ou connexion Google

### 2. Onboarding Personnalisé
- **Profil personnel**: Nom, âge, localisation, nationalité
- **Préférences fitness**: Objectifs, types d'entraînement, disponibilités  
- **Photos et vidéos**: Présentation visuelle complète
- **Vérification**: Processus de validation du compte

### 3. Exploration et Matching
- **Page de swipe**: Découverte de profils compatibles
- **Algorithme intelligent**: Suggestions basées sur la proximité et les affinités
- **Matches**: Connexion mutuelle pour débloquer le chat

### 4. Interaction Sociale
- **Feed principal**: Posts et stories de la communauté
- **Création de contenu**: Partage de photos, vidéos et moments fitness
- **Messagerie**: Communication directe avec les matches

### 5. Événements et Communauté
- **Découverte d'événements**: Cours, compétitions, sessions de groupe
- **Création d'événements**: Organisation de ses propres activités
- **Participation**: Inscription et suivi des événements

### 6. Fonctionnalités Avancées
- **Favoris**: Sauvegarde de profils et contenus intéressants
- **Recherche**: Filtres avancés pour trouver des utilisateurs spécifiques
- **Notifications**: Alertes pour matches, messages et événements
- **Profil personnel**: Gestion complète de son image et préférences

## 🛠 Technologies Utilisées

### Frontend
- **React Native 0.79.5** - Framework mobile cross-platform
- **Expo 53.0.20** - Plateforme de développement et déploiement
- **TypeScript** - Typage statique pour JavaScript
- **NativeWind** - Styling avec Tailwind CSS pour React Native
- **React Navigation** - Navigation entre écrans

### State Management
- **Redux Toolkit** - Gestion d'état predictible
- **React Redux** - Liaison React avec Redux
- **Redux Persist** - Persistance de l'état
- **TanStack Query** - Gestion des données serveur et cache

### Backend & Services
- **Firebase** - Backend-as-a-Service complet
  - **Authentication** - Gestion des utilisateurs
  - **Firestore** - Base de données NoSQL
  - **Storage** - Stockage des médias
- **Google Sign-In** - Authentification Google

### UI/UX
- **React Native Reanimated** - Animations fluides
- **React Native Gesture Handler** - Gestes tactiles avancés
- **Expo Image** - Gestion optimisée des images
- **Lottie** - Animations vectorielles
- **React Native Linear Gradient** - Gradients visuels

### Développement
- **ESLint** - Linting et qualité du code
- **Babel** - Transpilation JavaScript
- **Metro** - Bundler React Native

## 🚀 Installation et Développement

### ⚡ Démarrage rapide

Pour les développeurs expérimentés :
```bash
git clone https://github.com/nashthecoder/fitmatch-fixed.git
cd fitmatch-fixed
npm install
npx expo start
```

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18.0.0 ou supérieure)
  ```bash
  node --version  # Doit afficher v18.x.x ou plus
  ```
- **npm** (généralement installé avec Node.js)
  ```bash
  npm --version   # Doit afficher 8.x.x ou plus
  ```
- **Git** pour cloner le repository
- **Expo CLI** (sera installé automatiquement via npx)
- **Android Studio** (pour Android) ou **Xcode** (pour iOS) - optionnel pour le développement

### Installation pas à pas

1. **Vérifier les prérequis**
   ```bash
   node --version && npm --version
   ```

2. **Cloner le repository**
   ```bash
   git clone https://github.com/nashthecoder/fitmatch-fixed.git
   cd fitmatch-fixed
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```
   
   Si vous rencontrez des erreurs, essayez :
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Installer les dépendances manquantes** (si nécessaire)
   ```bash
   npx expo install expo-image-picker expo-video-thumbnails expo-network react-native-web
   npm install react-native-video react-native-ui-datepicker
   ```

5. **Configuration Firebase**
   - Placer `google-services.json` à la racine du projet (Android)
   - Placer `GoogleService-Info.plist` à la racine du projet (iOS)
   
   ⚠️ **Important**: Ces fichiers sont requis pour Firebase mais ne sont pas inclus dans le repository pour des raisons de sécurité.

6. **Vérifier l'installation**
   ```bash
   npm run lint  # Vérifier le code (des warnings sont normaux)
   ```

8. **Vérifier l'installation (optionnel)**
   ```bash
   chmod +x scripts/verify-setup.sh
   ./scripts/verify-setup.sh
   ```
   
   Ce script vérifie que tous les prérequis sont installés correctement.

9. **Démarrer le serveur de développement**
   ```bash
   npx expo start
   ```
   
   Le serveur Metro devrait démarrer et afficher un QR code.

### Vérification de l'installation

Après l'installation, vous devriez voir :
- ✅ Metro bundler en cours d'exécution sur `http://localhost:8081`
- ✅ QR code affiché dans le terminal
- ✅ Options pour ouvrir l'app (a/i/w dans le terminal)

Si le serveur démarre avec succès, votre installation est correcte !

### Options de lancement

- **🤖 Android**: Appuyer sur `a` dans le terminal ou scanner le QR code
- **🍎 iOS**: Appuyer sur `i` dans le terminal ou scanner le QR code  
- **🌐 Web**: Appuyer sur `w` pour ouvrir dans le navigateur
- **📱 Expo Go**: Scanner le QR code avec l'app Expo Go

### Scripts disponibles

```bash
npm start          # Démarre Expo
npm run android    # Build et lance sur Android
npm run ios        # Build et lance sur iOS  
npm run web        # Lance la version web
npm run lint       # Vérifie la qualité du code
```

## 🛠 Résolution des problèmes

### Problèmes courants et solutions

**1. Erreur "Cannot find module 'tailwind.config'"**
```bash
# Solution : Le fichier tailwind.config.js est requis
# Il devrait être créé automatiquement, sinon créez-le avec :
echo "module.exports = { content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'], presets: [require('nativewind/preset')], theme: { extend: {} }, plugins: [] }" > tailwind.config.js
```

**2. Erreurs de dépendances manquantes**
```bash
# Installer toutes les dépendances optionnelles
npx expo install expo-image-picker expo-video-thumbnails expo-network react-native-web
npm install react-native-video react-native-ui-datepicker
```

**3. Erreur "Metro bundler failed to start"**
```bash
# Nettoyer le cache et redémarrer
npx expo start --clear
# ou
rm -rf node_modules package-lock.json && npm install
```

**4. Erreurs de Firebase**
- Vérifiez que `google-services.json` et `GoogleService-Info.plist` sont à la racine
- Assurez-vous que votre projet Firebase est correctement configuré

**5. Problèmes avec l'émulateur/simulateur**
```bash
# Pour Android (vérifier qu'Android Studio est installé)
npx expo run:android

# Pour iOS (macOS uniquement, vérifier que Xcode est installé)
npx expo run:ios
```

**6. Problèmes de performance ou de cache**
```bash
# Réinitialiser complètement le projet
rm -rf node_modules/.cache
npx expo start --clear
```

### Vérification de l'environnement

Pour diagnostiquer les problèmes, utilisez :
```bash
npx expo doctor  # Vérifier la configuration Expo
npm ls           # Vérifier les dépendances installées
node --version   # Vérifier la version Node.js
```

### Fichiers de configuration requis

Les fichiers suivants sont automatiquement créés ou requis :

**Fichiers de configuration :**
- `tailwind.config.js` - Configuration TailwindCSS pour NativeWind
- `metro.config.js` - Configuration Metro bundler
- `babel.config.js` - Configuration Babel
- `tsconfig.json` - Configuration TypeScript

**Custom Hooks créés :**
- `customHooks/useIsKeyboardVisible.ts` - Détection du clavier virtuel
- `customHooks/useEmailAuth.ts` - Authentification par email
- `customHooks/useGoogleSignIn.ts` - Authentification Google
- `customHooks/useUserList.ts` - Liste des utilisateurs
- `customHooks/useHandleFormChange copy.ts` - Gestion des formulaires

**Fichiers Firebase requis :**
- `google-services.json` (Android) - À placer à la racine
- `GoogleService-Info.plist` (iOS) - À placer à la racine

## 📱 Structure du Projet

```
fitmatch-fixed/
├── app/                    # Écrans de l'application (Expo Router)
│   ├── (root)/            # Écrans principaux (tabs)
│   │   ├── Home/          # Fil d'actualité et posts
│   │   ├── MessageScreen/ # Chat et conversations
│   │   └── ...            # Autres onglets
│   ├── Auth/              # Authentification
│   ├── Users/             # Gestion utilisateurs
│   ├── Partner/           # Profils partenaires
│   └── Events/            # Système d'événements
├── components/            # Composants réutilisables
│   ├── Posts/             # Composants posts et feed
│   ├── Stories/           # Composants stories
│   └── shared/            # Composants partagés
├── config/                # Configuration (Firebase, etc.)
├── helpers/               # Utilitaires et helpers
├── store/                 # Configuration Redux
└── assets/                # Images, fonts, etc.
```

## 🔧 Configuration

### Variables d'environnement
L'application utilise Firebase pour les services backend. Assurez-vous d'avoir configuré :

- **Firebase Project ID**: Défini dans `app.json`
- **Google Services**: Fichiers de configuration placés à la racine
- **API Keys**: Configurés dans Firebase Console

### Déploiement
L'application est configurée pour le déploiement avec EAS Build :

```bash
npx eas build --platform all
```

## 👥 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés.

## 📞 Contact & Support

- **Développeur**: @julianojosoa13
- **Repository**: [nashthecoder/fitmatch-fixed](https://github.com/nashthecoder/fitmatch-fixed)

## 📚 Project Documentation

**Comprehensive Wiki Available**: For detailed documentation about the project, including changes made, current status, and development guides, visit our **[Project Wiki](https://github.com/nashthecoder/fitmatch-fixed/wiki)**.

### Quick Wiki Navigation:
- **[Project Overview](https://github.com/nashthecoder/fitmatch-fixed/wiki/Project-Overview)** - Complete app description and features
- **[Current Status](https://github.com/nashthecoder/fitmatch-fixed/wiki/Current-Status)** - Current state and health metrics
- **[Changes Made](https://github.com/nashthecoder/fitmatch-fixed/wiki/Changelog)** - Detailed record of all improvements
- **[Prior State](https://github.com/nashthecoder/fitmatch-fixed/wiki/Prior-State)** - App status before improvements
- **[Pending Fixes](https://github.com/nashthecoder/fitmatch-fixed/wiki/Pending-Fixes)** - Roadmap to 100% completion
- **[Development Guide](https://github.com/nashthecoder/fitmatch-fixed/wiki/Development-Guide)** - Setup and development workflow
- **[Technical Architecture](https://github.com/nashthecoder/fitmatch-fixed/wiki/Technical-Architecture)** - System design and architecture

---

**FitMatch** - Transformez votre passion pour le fitness en connexions authentiques ! 🏋️‍♀️💪

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

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Expo CLI
- Android Studio (pour Android) ou Xcode (pour iOS)

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/nashthecoder/fitmatch-fixed.git
   cd fitmatch-fixed
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Firebase**
   - Placer `google-services.json` à la racine (Android)
   - Placer `GoogleService-Info.plist` à la racine (iOS)

4. **Démarrer le serveur de développement**
   ```bash
   npx expo start
   ```

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

---

**FitMatch** - Transformez votre passion pour le fitness en connexions authentiques ! 🏋️‍♀️💪

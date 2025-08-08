# FitMatch 💪

**"Moins de swipe, plus de résultats"** - Une application sociale de fitness révolutionnaire qui connecte les passionnés de sport pour s'entraîner ensemble.

FitMatch est une application mobile cross-platform qui combine les aspects sociaux des applications de rencontre avec le monde du fitness, permettant aux utilisateurs de trouver leur binôme d'entraînement idéal et de rejoindre une communauté active.

## 🎯 Fonctionnalités principales

🏋️ **Matching Fitness** - Système de swipe pour découvrir des partenaires d'entraînement compatibles  
💬 **Réseau Social Fitness** - Fil d'actualité, chat direct et interactions communautaires  
📅 **Organisation d'Événements** - Création et gestion d'événements sportifs publics et privés  
🏪 **Partenariats & Marques** - Profils spéciaux pour les marques et partenaires fitness

## 🛠 Technologies Utilisées

**Frontend**: React Native 0.79.5, Expo 53.0.20, TypeScript, NativeWind  
**State Management**: Redux Toolkit, TanStack Query  
**Backend**: Firebase (Authentication, Firestore, Storage)  
**UI/UX**: React Native Reanimated, Gesture Handler, Lottie animations

## 🚀 Démarrage rapide

### Installation
```bash
git clone https://github.com/nashthecoder/fitmatch-fixed.git
cd fitmatch-fixed
npm install --legacy-peer-deps
npx expo start
```

### Prérequis
- **Node.js** 18.0.0+
- **npm** 8.x.x+
- **Expo CLI** (installé automatiquement)

### Configuration Firebase
Placez les fichiers de configuration Firebase à la racine :
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)

### Lancement
- **🤖 Android**: `a` dans le terminal ou scannez le QR code
- **🍎 iOS**: `i` dans le terminal ou scannez le QR code  
- **🌐 Web**: `w` pour ouvrir dans le navigateur

### Scripts disponibles
```bash
npm start          # Démarrer Expo
npm run android    # Build et lance sur Android
npm run ios        # Build et lance sur iOS  
npm run web        # Lance la version web
npm run lint       # Vérifier la qualité du code
```

## 📁 Structure du Projet

```
fitmatch-fixed/
├── app/                    # Écrans de l'application (Expo Router)
│   ├── (root)/            # Écrans principaux (tabs)
│   ├── Auth/              # Authentification
│   ├── Users/             # Gestion utilisateurs
│   └── Events/            # Système d'événements
├── components/            # Composants réutilisables
├── config/                # Configuration (Firebase, etc.)
├── store/                 # Configuration Redux
└── wiki/                  # Documentation complète
```

## 📚 Documentation

**Consultez notre [Wiki complet](wiki/README.md)** pour une documentation détaillée incluant :

- **[Aperçu du projet](wiki/Project-Overview.md)** - Description complète et fonctionnalités
- **[Guide de développement](wiki/Development-Guide.md)** - Configuration et workflow détaillés
- **[Architecture technique](wiki/Technical-Architecture.md)** - Design système et architecture
- **[État actuel](wiki/Current-Status.md)** - Santé du projet et métriques
- **[Guide de déploiement](wiki/Production-Deployment.md)** - Déploiement mobile et production

## 👥 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Contact

- **Repository**: [nashthecoder/fitmatch-fixed](https://github.com/nashthecoder/fitmatch-fixed)
- **Documentation**: [Wiki complet](wiki/README.md)

---

**FitMatch** - Transformez votre passion pour le fitness en connexions authentiques ! 🏋️‍♀️💪

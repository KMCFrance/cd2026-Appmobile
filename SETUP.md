# Celebration du Dharma 2026 — Guide de mise en place

## Architecture

- **GitHub Pages** : heberge l'application (gratuit)
- **Firebase Realtime Database** : stocke toutes les donnees (gratuit)
- **admin.html** : interface pour les organisateurs (mot de passe partage)
- **index.html** : l'application publique (PWA)

---

## Etape 1 : Creer un projet Firebase (5 min)

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer **"Ajouter un projet"** (ou "Create a project")
3. Nom du projet : `cd2026` (ou ce que vous voulez)
4. Desactiver Google Analytics (pas necessaire) → **Creer le projet**
5. Dans le menu gauche, cliquer **"Build"** → **"Realtime Database"**
6. Cliquer **"Creer une base de donnees"** (Create Database)
7. Region : choisir **Europe (europe-west1)**
8. Mode de demarrage : choisir **"Mode test"** (on securisera apres)
9. Cliquer **"Activer"**

Vous obtenez une URL de ce type :
```
https://cd2026-default-rtdb.europe-west1.firebasedatabase.app
```
**Copiez cette URL**, vous en aurez besoin partout.

### Regles de securite Firebase

Dans l'onglet **"Regles"** de votre base de donnees, collez ceci :
```json
{
  "rules": {
    "data": {
      ".read": true,
      ".write": true
    },
    "config": {
      ".read": true,
      ".write": true
    }
  }
}
```
Puis cliquez **"Publier"**.

> Note : Les donnees sont publiques en lecture (c'est normal, elles sont affichees dans l'app). L'ecriture est protegee par le mot de passe dans admin.html.

---

## Etape 2 : Migrer les donnees depuis Google Sheets

1. Ouvrir `migrate-to-firebase.html` dans votre navigateur (double-clic sur le fichier)
2. L'URL Apps Script est deja pre-remplie
3. Collez votre URL Firebase
4. Cliquez **"Lancer la migration"**
5. Verifiez que toutes les sections sont marquees "OK"

---

## Etape 3 : Configurer l'application

### index.html
Ouvrir `index.html` et modifier la ligne `FIREBASE_URL` :
```javascript
const CONFIG = {
  FIREBASE_URL: 'https://cd2026-default-rtdb.europe-west1.firebasedatabase.app',
  REFRESH_MS: 5 * 60 * 1000,
};
```

### admin.html
Ouvrir `admin.html` et modifier la ligne `FIREBASE_URL` :
```javascript
const CONFIG = {
  FIREBASE_URL: 'https://cd2026-default-rtdb.europe-west1.firebasedatabase.app',
};
```

---

## Etape 4 : Creer le depot GitHub

1. Aller sur [github.com](https://github.com) et creer un compte (si pas deja fait)
2. Cliquer **"+"** en haut a droite → **"New repository"**
3. Nom : `cd2026-app`
4. Visibilite : **Public** (necessaire pour GitHub Pages gratuit)
5. **Ne PAS** cocher "Add a README" (on a deja nos fichiers)
6. Cliquer **"Create repository"**

### Pousser les fichiers

Depuis un terminal (ou Git Bash sur Windows) :

```bash
cd chemin/vers/cd2026-app
git init
git add index.html admin.html sw.js manifest.json icon-192.png icon-512.png apple-touch-icon.png SETUP.md
git commit -m "Initial commit - CD2026 app"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/cd2026-app.git
git push -u origin main
```

> **Fichiers a NE PAS pousser** : `migrate-to-firebase.html` (outil usage unique), `apps-script.js` (plus necessaire)

---

## Etape 5 : Activer GitHub Pages

1. Aller dans **Settings** du repo → **Pages** (menu gauche)
2. Source : **Deploy from a branch**
3. Branch : **main** / **/ (root)**
4. Cliquer **Save**
5. Attendre 1-2 minutes

Votre app est maintenant accessible a :
```
https://VOTRE-UTILISATEUR.github.io/cd2026-app/
```

L'admin est a :
```
https://VOTRE-UTILISATEUR.github.io/cd2026-app/admin.html
```

---

## Etape 6 : Premier mot de passe admin

1. Ouvrir `admin.html` dans le navigateur
2. La page detecte qu'aucun mot de passe n'existe → affiche "Creer un mot de passe"
3. Entrez le mot de passe que vous partagerez avec les 2-3 organisateurs
4. Confirmez → vous etes connecte

---

## Utilisation quotidienne

### Modifier les donnees (organisateurs)
1. Ouvrir `admin.html` dans le navigateur
2. Se connecter avec le mot de passe
3. Choisir l'onglet (Programme, Cafe, etc.)
4. Modifier, ajouter ou supprimer des elements
5. Cliquer "Sauvegarder" pour chaque section modifiee
6. Les changements apparaissent dans l'app en moins de 5 minutes

### Mettre a jour l'app (vous uniquement)
1. Modifier le code localement
2. `git add . && git commit -m "description" && git push`
3. GitHub Pages deploie automatiquement en 1-2 min

---

## QR Code

Pour le badge des participants, generez un QR code pointant vers :
```
https://VOTRE-UTILISATEUR.github.io/cd2026-app/
```

---

## Domaine personnalise (optionnel)

Si vous voulez `cd2026.kadampafrance.org` au lieu de l'URL GitHub :
1. Settings → Pages → Custom domain
2. Entrez votre domaine
3. Ajoutez un enregistrement CNAME dans votre DNS pointant vers `VOTRE-UTILISATEUR.github.io`

---

## Structure des fichiers

```
cd2026-app/
  index.html           <- App publique (PWA)
  admin.html           <- Interface admin (organisateurs)
  sw.js                <- Service Worker (cache + offline)
  manifest.json        <- Manifest PWA
  icon-192.png         <- Icone 192px
  icon-512.png         <- Icone 512px
  apple-touch-icon.png <- Icone iOS
  SETUP.md             <- Ce guide
```

# inceShop

Application e-commerce complète (frontend React + backend Express) pour la gestion d’une boutique de matériel de beauté.

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install              # dépendances frontend
cd backend && npm install # dépendances backend
```

## Lancement en développement

Dans deux terminaux séparés :

```bash
# Backend API (http://localhost:4000)
npm run backend

# Frontend Vite (http://localhost:5173)
npm run dev
```

Le frontend communique avec l’API via `VITE_API_URL` (par défaut `http://localhost:4000/api`). Créez un fichier `.env` à la racine si vous devez changer l’URL :

```
VITE_API_URL=http://localhost:4000/api
```

## Scripts utiles

| Commande               | Description                                  |
|------------------------|----------------------------------------------|
| `npm run dev`          | Démarre le frontend avec Vite                |
| `npm run build`        | Build de production du frontend              |
| `npm run preview`      | Prévisualisation du build Vite               |
| `npm run lint`         | Lint du code React                           |
| `npm run backend`      | Lance l’API Express (via nodemon)            |
| `npm --prefix backend start` | Lance l’API en mode production        |

## Backend

- API REST Express avec stockage JSON (`backend/db.json` généré automatiquement au premier démarrage)
- Endpoints : produits, catégories, paramètres, commandes, auth fictive, upload de fichiers et journalisation des messages.
- Les fichiers envoyés sont stockés dans `backend/uploads/`.

## Frontend

- React 19 + Vite
- TailwindCSS pour le design
- React Router pour la navigation
- React Query pour les appels API
- Composants UI maison (`src/components/ui`)

## Tests manuels recommandés

1. Démarrer backend + frontend (`npm run backend` et `npm run dev`)
2. Vérifier le catalogue, la recherche, le panier et le checkout
3. Tester l’espace admin (produits, commandes, paramètres)
4. Vérifier l’upload d’images et la mise à jour des paramètres

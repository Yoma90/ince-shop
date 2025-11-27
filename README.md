# inceShop

Application e-commerce complète (frontend React + backend Express) pour la gestion d’une boutique de matériel de beauté.

## Prérequis

- Node.js 18+
- Yarn 1.x ou 4.x (selon votre workflow)
- Laragon (ou toute stack MySQL compatible) avec un serveur MySQL accessible

## Installation

1. **Frontend**
   ```bash
   yarn            # installe les dépendances à la racine
   ```

2. **Backend**
   ```bash
   cd backend
   yarn
   ```

3. **Base de données (Laragon)**
   - Importez `backend/schema.sql` via phpMyAdmin ou HeidiSQL pour créer la base `inceshop` et les données de démo.
   - Copiez `backend/env.example` vers `backend/.env` (ou `env.local`) puis ajustez l’accès MySQL :
     ```
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=inceshop
     ```

## Lancement en développement

Dans deux terminaux séparés :

```bash
# Backend API (http://localhost:4000)
yarn backend

# Frontend Vite (http://localhost:5173)
yarn dev
```

Le frontend communique avec l’API via `VITE_API_URL` (par défaut `http://localhost:4000/api`). Créez un fichier `.env` à la racine si vous devez changer l’URL :

```
VITE_API_URL=http://localhost:4000/api
```

## Scripts utiles

| Commande                | Description                                  |
|-------------------------|----------------------------------------------|
| `yarn dev`              | Démarre le frontend avec Vite                |
| `yarn build`            | Build de production du frontend              |
| `yarn preview`          | Prévisualisation du build Vite               |
| `yarn lint`             | Lint du code React                           |
| `yarn backend`          | Lance l’API Express (nodemon)                |
| `yarn backend:start`    | Lance l’API Express en mode production       |

## Backend

- API REST Express reliée à MySQL (Laragon) via `mysql2`.
- Endpoints : produits, catégories, paramètres, commandes, auth fictive, upload de fichiers et journalisation des messages.
- Les fichiers envoyés sont stockés dans `backend/uploads/`.

## Frontend

- React 19 + Vite
- TailwindCSS pour le design
- React Router pour la navigation
- React Query pour les appels API
- Composants UI maison (`src/components/ui`)

## Tests manuels recommandés

1. Démarrer backend + frontend (`yarn backend` et `yarn dev`)
2. Vérifier le catalogue, la recherche, le panier et le checkout
3. Tester l’espace admin (produits, commandes, paramètres)
4. Vérifier l’upload d’images et la mise à jour des paramètres

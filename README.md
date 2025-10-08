# NovaBoutique Storefront

Ce projet est un site vitrine statique présentant plusieurs pages :
- **Accueil** (`index.html`)
- **Catalogue** (`products.html`)
- **Recherche** (`search.html`)
- **Panier** (`cart.html`)
- **Contact** (`contact.html`)
- **Paiement** (`checkout.html`)

## Tester le site en local

Comme le site est composé de fichiers HTML statiques, il suffit de lancer un serveur HTTP local et d'ouvrir l'URL correspondante dans votre navigateur.

### Option 1 : depuis VS Code avec l'extension *Live Server*
1. Ouvrez ce dossier dans VS Code.
2. Installez l'extension « Live Server » si ce n'est pas déjà fait.
3. Cliquez sur « Go Live » en bas à droite. Le site sera servi sur `http://127.0.0.1:5500/` (ou un port similaire).

### Option 2 : via le script `start.sh`
Un script d'aide est fourni à la racine du projet :
```bash
cd /chemin/vers/le/projet
./start.sh
```
Par défaut, le site est servi sur `http://localhost:8000`. Vous pouvez changer le port via la variable d'environnement `PORT`, par exemple :
```bash
PORT=9000 ./start.sh
```

### Option 3 : directement via Python
Si vous préférez lancer manuellement le serveur Python :
```bash
cd /chemin/vers/le/projet
python -m http.server 8000
```
Ensuite, rendez-vous sur `http://localhost:8000/index.html` dans votre navigateur.

### Option 4 : via Node.js
Si vous préférez Node.js, vous pouvez utiliser `npx serve` :
```bash
cd /chemin/vers/le/projet
npx serve .
```
Par défaut, l'application sera disponible sur `http://localhost:3000`.

## Structure du projet
```
.
├── cart.html
├── checkout.html
├── contact.html
├── css/
├── images/
├── index.html
├── js/
├── products.html
└── search.html
```

## Scripts front
Les fonctionnalités interactives (recherche, panier, paiement) se trouvent dans le dossier `js/`.

## Licence
Ce projet est fourni tel quel pour vos expérimentations.

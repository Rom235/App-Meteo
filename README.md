# Application Météo

Application web simple qui permet de saisir une ville et d'afficher la météo actuelle ainsi que les prochaines heures.

## Fonctionnalités

- Recherche météo par nom de ville.
- Affichage de la météo courante avec température, état du ciel et vitesse du vent.
- Affichage des prévisions horaires sur les prochaines heures.
- Affichage de la probabilité de pluie pour chaque heure.
- Interface lisible sur une image de fond.
- Support de la touche `Entrée` pour lancer la recherche.
- Message de résultat accessible via `aria-live`.

## Principe de fonctionnement

1. L'utilisateur saisit une ville dans le champ prévu.
2. L'application interroge d'abord l'API de géocodage Open-Meteo pour trouver les coordonnées de la ville.
3. L'application interroge ensuite l'API météo Open-Meteo avec ces coordonnées.
4. Les données reçues sont affichées dans la zone de résultat.

## Données affichées

- Ville trouvée.
- Température actuelle.
- État du ciel.
- Vitesse du vent.
- Prévisions horaires.
- Probabilité de pluie par heure.

## Structure du projet

- `index.html` : structure de la page et zone d'affichage.
- `styles.css` : mise en page, fond d'écran, panneau principal et cartes horaires.
- `index.js` : logique de recherche, appels API et rendu des résultats.
- `Medias/` : images locales du projet.

## Lancer l'application

Le projet est une application statique. Il suffit d'ouvrir `index.html` dans un navigateur.

Si tu utilises un serveur local, place-toi dans le dossier du projet et sers les fichiers comme un site statique.

## Crédits image

Photo de Francis Friedlander, Pexels :
https://www.pexels.com/fr-fr/photo/nature-campagne-agriculture-exterieur-8559665/

L'image utilisée en fond est chargée depuis Pexels et possède un attribut `alt` pour l'accessibilité.

## Accessibilité

- Le bloc de résultats utilise `aria-live` pour annoncer les mises à jour.
- L'image de fond possède un texte alternatif.
- La touche `Entrée` lance aussi la recherche.

## Dépendances

Aucune dépendance locale. L'application repose uniquement sur le navigateur et sur les API publiques Open-Meteo.

## Limites

- Une connexion internet est nécessaire pour interroger les API météo.
- La précision dépend des données renvoyées par Open-Meteo.

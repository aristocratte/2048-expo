# Comprendre le 2048

Les couleurs et les cases sont celles du projet de départ. La logique du jeu est dans `src/utils/board.ts`, et l’écran de jeu est dans `src/app/game.tsx`.

## La grille

`board` est un tableau de quatre lignes contenant chacune quatre nombres. `0` signifie « case vide ». Le composant `Cell` affiche le nombre.

```text
[2, 2, 0, 0]
[0, 0, 0, 0]
[0, 0, 0, 0]
[0, 0, 0, 0]
```

## Fusionner une ligne

`moveLineLeft` fait trois choses : enlever les zéros, fusionner les voisins égaux, remettre des zéros à la fin.

```text
[2, 0, 2, 4] -> [2, 2, 4] -> [4, 4] -> [4, 4, 0, 0]
```

Cette fusion rapporte 4 points. La nouvelle case ne fusionne pas une deuxième fois dans ce mouvement. Le `i++` supplémentaire saute le deuxième nombre de la paire.

`moveBoard` utilise cette même fonction pour les quatre directions. Pour la droite, il inverse la ligne avant et après le calcul. Pour le haut et le bas, il prend les colonnes à la place des lignes.

## Mettre à jour la partie

`useState` garde la grille et le score dans `game`. `play` reçoit une direction, calcule le déplacement et utilise `setGame` pour afficher le résultat. Si la grille a changé, il ajoute une case 2 ou 4 et les points gagnés. Sinon, il garde la grille précédente.

`current` représente la partie la plus récente. On copie les lignes avec `[...row]` pour ne pas modifier directement l’ancienne grille.

## Glisser avec le doigt

`PanResponder` mesure `dx` (horizontal) et `dy` (vertical). À la fin du geste, `getSwipeDirection` choisit l’axe principal. Un geste de moins de 20 pixels est ignoré. Un glissement déclenche un seul mouvement.

Les nombres ne bloquent pas le geste grâce à `pointerEvents: "none"` dans les cases. Il n’y a pas de boutons directionnels ni d’animation personnalisée à comprendre.

## Terminer et naviguer

`isGameOver` vérifie s’il reste une case vide ou deux voisins égaux. S’il n’y a aucun des deux, `useEffect` ouvre Game Over et transmet le score. Le bouton **Terminar juego** permet aussi de terminer volontairement.

Expo Router associe chaque fichier de `src/app` à un écran. `router.replace` passe au jeu ou au résultat. `router.push` ouvre les crédits ; `router.back` revient à l’écran précédent.

Pour la démonstration, montre une fusion, le score, les gestes, une nouvelle partie et les crédits. Il faut encore tester personnellement l’application dans Expo Go sur le téléphone.

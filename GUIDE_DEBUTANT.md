# Comprendre le code du 2048

Quand tu glisses le doigt, le jeu choisit une direction. Il déplace les nombres dans cette direction, fusionne les nombres égaux, ajoute les points et affiche la nouvelle grille.

Tu peux suivre ce chemin dans le code :

```text
Geste du doigt
    -> getSwipeDirection choisit la direction
    -> play lance le mouvement
    -> moveBoard traite la grille
    -> moveLineLeft calcule les fusions et les points
    -> setGame met à jour la partie
    -> React affiche le résultat
```

`src/app/game.tsx` contient l'écran de jeu et les gestes. `src/utils/board.ts` contient les règles. `src/components/cell.tsx` affiche une case. Les couleurs restent celles du projet de départ.

## 1. La grille et le score

La grille est un tableau de quatre lignes. Chaque ligne contient quatre nombres. Le nom de ce tableau est `board`.

```text
[2, 0, 2, 4]
[0, 0, 0, 0]
[0, 0, 0, 0]
[0, 0, 0, 0]
```

Dans cet exemple, la première ligne contient trois cases occupées. Les autres cases sont vides. Le nombre `0` sert à représenter une case vide.

La partie contient la grille et le score :

```ts
return { board: createBoard(), score: 0 }
```

`createBoard()` prépare une grille vide, puis ajoute deux cases au hasard. Le score commence à zéro.

Cette ligne garde la partie dans la mémoire de React :

```ts
const [game, setGame] = useState(createGame)
```

`game` contient la partie actuelle. `setGame` permet de la remplacer par la partie mise à jour. React peut alors afficher les nouveaux nombres et le nouveau score.

## 2. Le doigt touche la grille

Dans `game.tsx`, `PanResponder` reçoit les événements du doigt.

```ts
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  onPanResponderMove: event => event.preventDefault(),
  onPanResponderRelease: (_event, gesture) => {
    const direction = getSwipeDirection(gesture.dx, gesture.dy)
    if (direction) play(direction)
  },
})
```

Les deux premières lignes disent que la grille accepte de gérer le geste. `onPanResponderMove` empêche le comportement par défaut de l'événement, par exemple le déplacement de la page dans le navigateur.

`onPanResponderRelease` est appelé quand tu relâches le doigt. C'est à ce moment que le jeu effectue le mouvement.

Dans la ligne qui affiche la grille, cette partie relie les événements à `PanResponder` :

```tsx
{...panResponder.panHandlers}
```

Les cases ont aussi `pointerEvents: "none"`. Cela laisse la grille recevoir le geste, même si ton doigt touche un nombre.

## 3. Choisir la direction du slide

React Native fournit deux nombres :

- `dx` mesure le déplacement horizontal
- `dy` mesure le déplacement vertical

Un `dx` positif correspond à la droite. Un `dx` négatif correspond à la gauche. Un `dy` positif correspond au bas et un `dy` négatif correspond au haut.

Le code regarde d'abord si le geste est assez grand :

```ts
if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return null
```

`Math.abs` enlève le signe d'un nombre. Par exemple, `Math.abs(-80)` donne `80`. `Math.max` garde la plus grande des deux distances.

Si les deux déplacements restent inférieurs à 20, le code retourne `null`. Cela signifie qu'il ne faut pas déplacer la grille. Un petit tap sur l'écran est donc ignoré.

Ensuite, le code compare les distances :

```ts
if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right"
return dy < 0 ? "up" : "down"
```

Si le déplacement horizontal est plus grand, le jeu choisit la gauche ou la droite. Sinon, il choisit le haut ou le bas. Un geste en diagonale donne donc une seule direction.

La forme `condition ? choix1 : choix2` signifie "si la condition est vraie, prends le premier choix, sinon prends le second".

Exemple : ton doigt fait `dx = -80` et `dy = 12`. La distance horizontale est 80, contre 12 verticalement. Le geste part à gauche. La fonction retourne `"left"`, puis le jeu appelle `play("left")`.

## 4. Déplacer et fusionner une ligne

La fonction `moveLineLeft` fait le calcul d'une ligne vers la gauche. Prenons cette ligne :

```text
[2, 0, 2, 4]
```

Elle commence par enlever les cases vides :

```ts
const numbers = line.filter(value => value !== 0)
```

`filter` garde les valeurs qui respectent la condition. Ici, il garde les nombres différents de zéro.

```text
[2, 0, 2, 4] devient [2, 2, 4]
```

Ensuite, une boucle regarde les nombres voisins. `i` est la position du nombre que la boucle examine. `numbers[i + 1]` est le nombre juste après.

Quand les deux nombres sont égaux, le code crée leur fusion :

```ts
const merged = numbers[i] * 2
result.push(merged)
points += merged
```

Les deux premiers nombres sont 2 et 2. `merged` vaut donc 4. `result.push(merged)` ajoute ce 4 à la ligne de résultat. `points += merged` ajoute 4 aux points gagnés pendant le mouvement.

Le code fait ensuite un `i++` supplémentaire pour passer le deuxième nombre de la paire. Ce nombre a déjà servi à la fusion.

La ligne de résultat contient alors deux 4 :

```text
[2, 2, 4] devient [4, 4]
```

Ces deux 4 restent séparés pendant ce mouvement. La boucle compare les nombres de départ, pas les nombres qu'elle vient de créer.

Enfin, la fonction ajoute des zéros pour retrouver quatre cases :

```text
[4, 4] devient [4, 4, 0, 0]
```

Le résultat complet de cet exemple est une ligne `[4, 4, 0, 0]` et 4 points gagnés.

Autre exemple :

```text
[2, 2, 2, 2] devient [4, 4, 0, 0]
Points gagnés : 4 + 4 = 8
```

Chaque paire fusionne une seule fois pendant le mouvement.

## 5. Faire le calcul dans les quatre directions

`moveBoard` réutilise le calcul d'une ligne pour toute la grille.

| Direction | Ce que fait le code |
|---|---|
| Gauche | Traiter chaque ligne avec `moveLineLeft` |
| Droite | Inverser la ligne, faire le calcul, puis inverser le résultat |
| Haut | Prendre les nombres de chaque colonne et faire le même calcul |
| Bas | Inverser chaque colonne avant le calcul, puis inverser le résultat |

Par exemple, pour déplacer `[2, 2, 4, 0]` à droite :

```text
Inverser la ligne       [0, 4, 2, 2]
Calculer vers la gauche [4, 4, 0, 0]
Inverser le résultat    [0, 0, 4, 4]
```

La fusion des deux 2 rapporte 4 points.

La fonction additionne les points des quatre lignes ou colonnes avec `points += result.points`.

Elle retourne trois informations : la nouvelle grille, les points gagnés et `changed`. `changed` indique si la grille a changé. Pour le vérifier, le code compare l'ancienne grille et la nouvelle sous forme de texte avec `JSON.stringify`.

## 6. Ajouter les points et une nouvelle case

Dans `game.tsx`, `play` met à jour la partie :

```ts
setGame(current => {
  const result = moveBoard(current.board, direction)
  if (!result.changed) return current
  return {
    board: addRandomTile(result.board),
    score: current.score + result.points,
  }
})
```

`current` est la partie la plus récente. Le code utilise sa grille pour calculer le mouvement.

Si `changed` vaut `false`, rien n'a bougé. `return current` conserve la partie. Aucune case n'est ajoutée et le score reste identique.

Si la grille a changé, `addRandomTile` choisit une case vide au hasard. Elle y place un 2 dans 90 % des cas et un 4 dans 10 % des cas.

La mise à jour du score est cette addition :

```ts
score: current.score + result.points
```

`current.score` est le total avant le mouvement. `result.points` contient seulement les points gagnés pendant ce mouvement.

| Fusion | Points ajoutés |
|---|---|
| 2 + 2 donne 4 | 4 |
| 4 + 4 donne 8 | 8 |
| 8 + 8 donne 16 | 16 |

Si ton score était 100 et que tu fais une fusion de deux 2, il passe à 104. Un déplacement sans fusion peut faire apparaître une nouvelle case, mais il ajoute zéro point. La nouvelle case aléatoire ne rapporte pas de points.

## 7. Afficher le résultat et détecter la fin

Quand `setGame` met à jour la partie, React affiche à nouveau l'écran. La ligne `game.board.map(...)` parcourt les lignes, puis les cases, pour afficher un composant `Cell` à chaque position.

Le jeu calcule le déplacement quand tu relâches le doigt. Les cases prennent ensuite leur nouvelle position. Il n'y a pas d'animation personnalisée qui les fait suivre le doigt.

Après le changement de partie, `useEffect` appelle `isGameOver`. Cette fonction cherche une case vide ou deux voisins égaux, horizontalement ou verticalement. Si elle en trouve, tu peux continuer. Si elle n'en trouve aucun, le jeu ouvre Game Over avec le score final.

## Les mots à connaître

| Nom dans le code | Sens |
|---|---|
| `board` | Grille |
| `line` | Une ligne de nombres |
| `direction` | Gauche, droite, haut ou bas |
| `points` | Points gagnés pendant un mouvement |
| `score` | Total des points de la partie |
| `current` | Partie actuelle |
| `result` | Résultat du calcul |
| `changed` | Vrai si la grille a changé |

## Ce que tu peux dire en classe

"Notre jeu utilise une grille de quatre lignes et quatre colonnes. Quand on relâche le doigt, PanResponder nous donne le déplacement horizontal et vertical. On choisit la direction principale, puis on traite les lignes ou les colonnes. Deux nombres égaux fusionnent une fois et rapportent la valeur de la nouvelle case. On ajoute ensuite une case au hasard et React affiche la grille mise à jour. La partie se termine quand il n'y a plus de mouvement possible."

Pour une présentation en espagnol :

"El juego utiliza un tablero de cuatro filas y cuatro columnas. Al soltar el dedo, PanResponder nos da el desplazamiento horizontal y vertical. Elegimos la dirección principal y procesamos las filas o las columnas. Dos números iguales se fusionan una vez y sumamos el valor de la nueva ficha al marcador. Después añadimos una ficha aleatoria y React actualiza la pantalla. La partida termina cuando no quedan movimientos posibles."

Tu peux accompagner l'explication d'un geste vers la gauche, montrer une fusion de deux 2 et vérifier les 4 points ajoutés au score.

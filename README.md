# 2048

APLICACIONES MÓVILES · Universidad La Salle México.

Equipo: Aristide CORDONNIER, Mathis GIL y Oscar BUAT.

Repositorio: [aristocratte/2048-expo](https://github.com/aristocratte/2048-expo).

[Reporte de práctica en PDF](output/pdf/Reporte_2048%20-%20CORDONNIER%20-%20GIL%20-%20BUAT.pdf).

Se conserva la interfaz inicial: fondo gris, casillas blancas/grises y botones verdes. El juego se controla deslizando el dedo sobre la cuadrícula.

## Ejecutar

```bash
npm ci
npx expo start --go
```

Usa Node.js 22.13 o posterior y Expo Go compatible con SDK 57. Conecta el teléfono al mismo Wi-Fi que la computadora y escanea el QR. Para probar en el navegador, usa `npm run web`.

## Reglas

El tablero empieza con dos fichas. Dos números iguales se unen una sola vez por movimiento. Por ejemplo, `2 + 2 = 4` suma 4 puntos. Un movimiento válido añade una ficha 2 o 4. Si nada se mueve, no añade nada. La partida acaba cuando no quedan movimientos o al pulsar **Terminar juego**. **Volver a jugar** reinicia la partida.

## Código

- `src/app/`: presentación, juego, Game Over, créditos y navegación.
- `src/utils/board.ts`: reglas del tablero y dirección del gesto.
- `src/components/cell.tsx`: casilla original.
- `src/styles.tsx`: estilos originales.
- `GUIDE_DEBUTANT.md`: explicación sencilla en francés.

## Verificar

```bash
npm test
npm run typecheck
npm run lint
npx expo-doctor
```

La verificación web y las capturas están en `rendu/`. El reporte La Salle está en `output/pdf/`. Las pruebas en navegador y los bundles nativos no sustituyen la prueba física con Expo Go ni la demostración en clase, pendientes por parte del equipo.

Mecánica inspirada en [2048 de Gabriele Cirulli](https://github.com/gabrielecirulli/2048). El ranking mediante API se describe solo como mejora futura en el reporte.

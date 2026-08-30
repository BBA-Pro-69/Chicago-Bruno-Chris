# WindyCity Trip 2026 · Chicago

Carnet de voyage et application mobile pour le séjour à Chicago,
du 4 au 14 septembre 2026 (Bruno & Névine, Christophe & Laure),
avec le salon Esker All Access 2026 au Loews Chicago O'Hare.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le carnet : une seule page, données incluses, mode application intégré |
| `manifest.webmanifest` | Manifeste PWA : nom, icônes, mode standalone, raccourcis |
| `sw.js` | Service worker : cache hors ligne, mise à jour contrôlée |
| `.nojekyll` | Désactive Jekyll sur GitHub Pages (obligatoire) |
| `assets/` | Icônes de l'application (192, 512, maskable, Apple touch) |

## Publication

Déposer les fichiers à la **racine** du dépôt, en conservant le dossier
`assets/`. GitHub Pages sert le site en HTTPS, ce qui est indispensable
pour que le service worker s'active.

## Sections de la page

00 Le voyage · 01 L'esprit · 02 Vols · 03 Hôtels · 04 Planning ·
05 Agenda · 06 Salon pro · 07 Esker All Access · 08 Shopping ·
09 Météo · **10 Localisation** · **11 Où manger** · 12 Pratique ·
13 Bon voyage

Les sections 10 et 11 sont regroupées dans l'onglet « Lieux » de
l'application mobile.

## Mode application (mobile)

Sous 1024 px de large, la page bascule automatiquement en application :
barre de cinq onglets en bas d'écran (Aujourd'hui, Agenda, Lieux, Carnet,
Infos), navigation dans le fragment d'URL, geste retour géré, et
fonctionnement hors réseau une fois la première visite effectuée.

Sur iPhone : bouton Partager, puis « Sur l'écran d'accueil ».
Sur Android : la bannière d'installation apparaît d'elle-même.

Au-dessus de 1024 px, la version bureau est strictement identique à avant.

## Mise à jour

Après toute modification de `index.html`, incrémenter la constante
`VERSION` **aux deux endroits** où elle apparaît :

1. `sw.js`, ligne 12 : `const VERSION = '2026-08-29a';`
2. `index.html`, dans le script du mode application : `var V = '2026-08-29a';`

Sans cela, les anciens caches continueront d'être servis aux téléphones
qui ont déjà ouvert le carnet.

# WindyCity Trip 2026 — Chicago, 4 au 14 septembre

Site compagnon de voyage + application mobile (PWA) installable, pour Bruno & Névine,
Christophe & Laure. Page unique, aucune dépendance à builder.

## Fichiers à déposer à la racine du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le site : contenu, données, agenda dynamique, mode application |
| `manifest.webmanifest` | Manifeste PWA (nom, icônes, raccourcis, couleurs) |
| `sw.js` | Service worker : cache hors-ligne, bannière de mise à jour |
| `.nojekyll` | Désactive Jekyll sur GitHub Pages (fichier caché, ne pas oublier) |
| `favicon.ico` | Favicon |
| `assets/icon-192.png` | Icône PWA 192 px |
| `assets/icon-512.png` | Icône PWA 512 px |
| `assets/icon-maskable-512.png` | Icône maskable Android |
| `assets/apple-touch-icon-180.png` | Icône iOS |
| `assets/resto/*.jpg` | 5 photos hébergées localement (Portillo's et Panera, dont les CDN bloquent le lien direct) |

> `.nojekyll` est masqué par défaut dans le Finder (macOS : `Cmd + Shift + .`)
> et dans l'Explorateur Windows (Affichage → Éléments masqués).

## Sections de la page

| N° | Ancre | Contenu |
|---|---|---|
| 00 | `#hero` | Couverture et compte à rebours |
| 01 | `#esprit` | L'esprit du séjour |
| 02 | `#vols` | Vols aller et retour, correspondances |
| 03 | `#hotels` | Sonesta ES Suites et Loews Chicago O'Hare |
| 04 | `#planning` | Arbitrages, rooftops comparés, points de vigilance |
| 05 | `#agenda` | Agenda dynamique, 11 jours, 87 événements, 6 catégories |
| 06 | `#travail` | Organisation côté travail |
| 07 | `#esker` | Esker All Access 2026 |
| 08 | `#shopping` | Outlets et shopping |
| 09 | `#meteo` | Météo et bagages |
| 10 | `#lieux` | **Localisation** — 21 lieux du séjour, boutons Google Maps |
| 11 | `#manger` | **Où manger** — 21 restaurants, 6 catégories, photos, itinéraires depuis le Loews |
| 12 | `#gouter` | **Où goûter** — 10 adresses, 6 catégories, sélection par unanimité des avis |
| 13 | `#patisseries` | **Pâtisseries** — 8 adresses classées par style : américain, français, belge, italien |
| 14 | `#pratique` | ESTA, eSIM, argent, pourboires, urgences |
| 15 | `#fin` | Bon voyage |

Plus un écran `#today` visible uniquement en mode application.

## Mode application (PWA)

- Onglets en bas d'écran, navigation par ancre `#t=…`
- Fonctionne hors-ligne après la première visite
- Android : bannière « Installer l'application »
- iOS : Partager → « Sur l'écran d'accueil »
- Trois raccourcis d'icône : Aujourd'hui, Agenda, Lieux

## Publier une mise à jour

La version du cache doit être incrémentée **aux trois endroits** suivants,
sinon les téléphones déjà installés continueront de servir l'ancienne page :

1. `sw.js`, ligne 9 : `const VERSION = '2026-08-30d';`
2. `index.html`, ligne 13 : `manifest.webmanifest?v=2026-08-30d`
3. `index.html`, script « mode application » : `var V = '2026-08-30d';`

Version actuelle : **2026-08-30d**

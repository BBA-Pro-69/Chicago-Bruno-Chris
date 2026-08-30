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
| 14 | `#transports` | **Se déplacer** — Ventra, tarifs CTA, plans PDF, budget, bons plans |
| 15 | `#pratique` | ESTA, eSIM, argent, pourboires, urgences |
| 16 | `#fin` | Bon voyage |

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

1. `sw.js`, ligne 9 : `const VERSION = '2026-08-31b';`
2. `index.html`, ligne 13 : `manifest.webmanifest?v=2026-08-31b`
3. `index.html`, script « mode application » : `var V = '2026-08-31b';`

Version actuelle : **2026-08-31b**

## Navigation (refonte du 31 aout 2026)

### Ordinateur
La barre du haut ne contient plus 15 liens a plat mais **6 entrees** :
`Le voyage` (menu deroulant) · `Agenda` (lien direct) · `Le salon` · `Sur place` ·
`Se regaler` · `Bon a savoir`, plus un bouton **Installer**.
Les menus s'ouvrent au survol ou au clic (classe `.dd` / `.dd-panel`).
La rubrique courante s'allume dans son panneau, et son groupe s'allume dans la barre.

### Telephone (mode application)
La barre du bas compte **4 onglets + 1 bouton Menu** :
`Aujourd'hui` · `Agenda` · `Lieux` · `Manger` · `Menu`.
Le bouton Menu ouvre `#appmenu`, un panneau coulissant qui liste **les 17 rubriques**
groupees en 6 familles, avec le bouton Installer en tete.
Il s'ouvre aussi en **glissant le doigt vers le haut** depuis la barre,
se ferme par la poignee, le fond, la croix, la touche Echap ou le bouton retour du telephone.
Le bouton Menu s'allume automatiquement quand l'onglet courant n'est pas dans la barre
(onglets `voyage` et `infos`).

Le terme *carnet* a ete retire de toute l'interface : il ne disait rien a l'utilisateur.

### Defilement
`window.CX_GOTO(element, smooth)` remplace `scrollIntoView`.
Les sections ont un gros `padding-top` : sauter a leur bord superieur donnait
l'impression d'arriver dans le vide avant le titre. `CX_GOTO` retranche la hauteur
de la barre de navigation et l'essentiel du padding pour caler le titre en haut de l'ecran.
`window.CX_SECTION(id)` bascule sur le bon onglet puis appelle `CX_GOTO`.

### Ordre des sections
| # | id | onglet |
|---|----|--------|
| 00 | hero | voyage |
| 01 | spirit | voyage |
| 02 | vols | voyage |
| 03 | hotels | voyage |
| 04 | planning | voyage |
| 05 | agenda | agenda |
| 06 | travail | voyage |
| 07 | esker | voyage |
| 08 | shopping | voyage |
| 09 | lieux | lieux |
| 10 | transports | lieux |
| 11 | manger | manger |
| 12 | gouter | manger |
| 13 | patisseries | manger |
| 14 | meteo | infos |
| 15 | pratique | infos |
| 16 | fin | infos |

Le bandeau d'installation vit desormais **juste sous la navigation**, en flux normal
(plus de bandeau flottant). Il est supprime du DOM des que l'application est installee,
en meme temps que tous les elements `.js-install`.

## Revelation au defilement : correctif du 31 aout 2026

Symptome : dans l'agenda (vue liste), dans Localisation et dans Ou manger, aucune
fiche ne s'affichait. Il fallait cliquer sur un filtre pour que le contenu apparaisse.

Trois causes cumulees :

1. **Seuil impossible a atteindre.** L'observateur exigeait `threshold: 0.12`,
   soit 12 % de la hauteur de l'element visible a l'ecran. Les grilles de fiches
   mesurent plusieurs milliers de pixels : 12 % depassait la hauteur de l'ecran,
   donc le seuil ne pouvait jamais etre atteint et l'element restait a
   `opacity: 0` indefiniment. Corrige en `threshold: 0`.
2. **Conteneurs vides animes.** `#agList`, `#agDetail`, `#restoGrid`, `#gouterGrid`,
   `#patisGrid` et `#placeGrid` sont remplis par des scripts qui s'executent APRES
   la mise en place de l'animation. Ils etaient donc vides, traites comme un bloc
   unique a reveler, et leur contenu naissait invisible. `mark()` ignore desormais
   tout element vide au moment du marquage.
3. **Sections masquees par les onglets.** En mode application, l'observateur ne
   peut rien voir dans un onglet en `display:none`. L'effet est donc entierement
   desactive sous 1024 px, via une regle CSS `@media (max-width: 1023px)`.

Filets de securite ajoutes : `window.CX_REVEAL_ALL(scope)` force l'affichage,
appele a chaque changement d'onglet ; et au bout de 3 s tout element `.reveal`
qui touche l'ecran sans etre apparu est rendu visible de force.

Regle a retenir pour la suite : **ne jamais poser `.reveal` sur un conteneur
qui sera rempli par un script.**

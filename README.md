# ampai.tech

The AmpAI pre-launch page, served by GitHub Pages at https://ampai.tech.

- `index.html` – the page (3D plan hero, the problem, Upload / Check / Bid, founder, pilot form)
- `styles.css` – all styling, matching the AmpAI Showcase deck (near-black `#12151b`, off-white `#f4f1ea`,
  orange `#e8892b`, Oswald / DM Sans / JetBrains Mono)
- `assets/hero.js` + `assets/s02-wiring.js` – the hero animation: plan sheet S02 is scanned, tips into 3D, and
  Ryan's own S02 circuits (his 2026-10-14 markup) are roughed in: up out of the panel, square runs in the
  ceiling, a drop down to every box. Device dots sit on the print's symbols.
- The Upload, Check and Bid pictures are built in the page (HTML + SVG), so they stay sharp. The Check
  picture is AmpAI's Living runs and wire tags from the Human reviews screen, redrawn over `assets/s02.png`.
- `assets/*.jpg|png` – logo, S02 sheet, and photos from the Showcase deck
- `thanks.html` – shown after someone sends the pilot form
- `CNAME` – tells GitHub Pages to serve this repo at ampai.tech

The pilot form posts to the "AmpAI pilot request" Google Form in the ampai.tech Google Workspace
(Google Forms → Responses for the answers and email alerts). If you add or rename questions there, the
`entry.<number>` names in `index.html` must match the form's field IDs.
"Book a demo" opens the Google Calendar booking page.

To change the text, edit `index.html` and commit; the live site updates within a minute or two.

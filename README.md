# ampai.tech

The AmpAI pre-launch page, served by GitHub Pages at https://ampai.tech.

- `index.html` – the page (hero, features, how it works, sample job, FAQ, pilot form)
- `styles.css` – all styling (AmpAI navy `#0d1221`, amber `#f59e0b`, Inter / Geist Mono)
- `thanks.html` – shown after someone sends the pilot form
- `CNAME` – tells GitHub Pages to serve this repo at ampai.tech

The pilot form posts to the "AmpAI pilot request" Google Form in the ampai.tech Google Workspace
(Google Forms → Responses for the answers and email alerts). If you add or rename questions there, the
`entry.<number>` names in `index.html` must match the form's field IDs.
"Book a demo" opens the Google Calendar booking page.

To change the text, edit `index.html` and commit; the live site updates within a minute or two.

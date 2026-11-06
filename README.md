# Tierschutzverein – Demo-Website

Demo-Website von Steppencode für Tierschutzvereine und Tierheime, umgesetzt nach dem Design-Template (Hero „Zuhause gesucht.“). React 19 + Vite + TypeScript, dazu `lucide-react` (Icons) und die selbst gehosteten Schriften Fredoka und Figtree.

## Inhalt (Onepager)

| Bereich | Komponente |
|---|---|
| Header mit mobilem Menü, Button „Jetzt unterstützen“ | `src/components/Header.tsx` |
| Hero mit handgezeichnetem Herz und Unterstreichung | `src/components/Hero.tsx`, `src/components/Doodles.tsx` |
| Vier Stärken | `src/components/Features.tsx` |
| Tiere: Filter nach Tierart, Merkliste (localStorage), Steckbriefe | `src/components/Animals.tsx` |
| Mithelfen: Spendenbox (Betrag, einmalig/monatlich, IBAN kopieren), Patenschaft, Gassigehen, Pflegestelle, Sachspenden | `src/components/Help.tsx` |
| Über uns mit Kennzahlen | `src/components/About.tsx` |
| Aktuelles | `src/components/News.tsx` |
| Kontakt, Besuchszeiten, Tiernotfall | `src/components/Contact.tsx` |
| Footer mit Spendenkonto | `src/components/Footer.tsx` |

**Alle Texte, Tiere, Termine und Bankdaten** stehen in `src/data.ts`. Farben und Schriften sind CSS-Variablen oben in `src/styles.css`.

## Platzhalter vor dem Livegang ersetzen

- Vereinsname, Adresse, Telefon, Notfallnummer, E-Mail, Besuchszeiten (`src/data.ts`)
- **IBAN und BIC sind Platzhalter** (`src/data.ts`)
- Der Hinweis „Spenden steuerlich absetzbar“ und der Text zur Absetzbarkeit (`src/components/Help.tsx`) gelten nur, wenn der Verein auf der Liste der begünstigten Spendenempfänger steht – sonst entfernen.
- Tiere, Geschichte, Kennzahlen und Neuigkeiten (`src/data.ts`, `src/components/About.tsx`)
- Fotos in `public/images/` (derzeit Unsplash-Fotos; das Hero-Bild ist aus dem Template-Entwurf ausgeschnitten)
- „Kennenlernen“: Mit CMS landen Anfragen im CMS unter „Anfragen“, ohne CMS öffnet sich eine vorbereitete E-Mail. „Mehr erfahren“ sind E-Mail-Links. Online-Spenden gibt es nicht – die Spendenbox zeigt die Bankdaten (im CMS pflegbar).
- Impressum- und Datenschutzseite

## Inhalte aus dem CMS

Die Website lädt ihre Inhalte aus dem Steppencode-CMS (Kunde **`tierschutz`**): Navigation, Footer, Website-Einstellungen, Seiten (Startseite, Impressum, Datenschutz) und Beiträge. Die Sektionen der Seiten rendert die Block-Laufzeit des CMS – jede Sektion ist im visuellen Editor des CMS bearbeitbar, neue Blöcke kommen mit dem nächsten CMS-Deploy automatisch.

- `src/cms/` – Verbindung zum CMS (Kunde über `/api/tenants/lookup/tierschutz`, Block-Laufzeit, Navigation und Footer)
- `src/theme/blocks.theme.css` – legt das Design dieser Website über die Blöcke. Die Vorschau im CMS-Editor lädt genau dieses Stylesheet von der Website, inklusive der selbst gehosteten Schriften (deshalb `serve --cors`).
- Ist das CMS abgeschaltet (`VITE_CMS=off`), nicht erreichbar oder kennt den Kunden nicht, zeigt die Website ihre eingebauten Inhalte aus `src/data.ts`.

Env (siehe `.env.example`): `VITE_CMS_URL` (Standard `https://cms.steppencode.at`), `VITE_TENANT` (Standard `tierschutz`), `VITE_CMS=off`.

**Domain:** `tiere.steppencode.at` – im CMS beim Kunden **tierschutz** hinterlegt. Damit darf die Website die CMS-API abfragen (CORS), und die Vorschau im Editor zeigt ihr Design, sobald die Website unter dieser Adresse läuft.

Formulare (Anfragen, Bestellungen, Vorbestellungen) landen im CMS unter **Anfragen**.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Ausgabe in dist/
npm start        # dist/ auf Port 3000 ausliefern (Dokploy/Nixpacks)
```

## Mehrere Sprachen

Die Website kann mehrsprachig laufen – eingestellt im CMS unter *Website-Einstellungen → Sprachen*. Die Standardsprache steht ohne Präfix in der Adresse, weitere Sprachen mit (`/en/…`). Die Website erkennt die Sprache am Präfix, lädt Menü, Fußzeile und Einstellungen mit `?lang=` in dieser Sprache, zeigt die Seite dieser Sprache, gibt `locale` an die Block-Laufzeit (feste Texte, Datumsformate) und setzt `<html lang>`. Der Sprachumschalter in der Navigation erscheint erst ab zwei Sprachen und führt zur selben Seite in der anderen Sprache. Code: `src/cms/i18n.ts`. Details im README des CMS unter „Mehrsprachige Websites“.


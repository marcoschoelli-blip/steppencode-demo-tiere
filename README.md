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
- „Kennenlernen“ und „Mehr erfahren“ öffnen eine vorbereitete E-Mail. Für echte Formulare an ein Backend anbinden, z. B. das Steppencode-CMS. Für Online-Spenden kann ein Zahlungsanbieter ergänzt werden.
- Impressum- und Datenschutzseite

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Ausgabe in dist/
npm start        # dist/ auf Port 3000 ausliefern (Dokploy/Nixpacks)
```

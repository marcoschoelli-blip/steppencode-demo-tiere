/**
 * Mehrsprachige Website (Sprachen kommen aus dem CMS: Website-Einstellungen
 * → Sprachen). Die Standardsprache steht ohne Präfix in der Adresse
 * (`/kontakt`), weitere Sprachen mit Präfix (`/en/contact`).
 *
 * Jede Sprachfassung einer Seite ist im CMS eine eigene Seite; „Übersetzung
 * von“ verbindet sie. Menü, Fußzeile und Einstellungen liefert das CMS mit
 * `?lang=` gleich in der richtigen Sprache, Seitenlinks bringen ihre fertige
 * Adresse mit (`sitePath`).
 */

/** Sprachen, die das CMS kennt – Name in der Sprache selbst. */
export const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  sk: 'Slovenčina',
  hu: 'Magyar',
  sl: 'Slovenščina',
  hr: 'Hrvatski',
}

export type SiteLanguages = { default: string; all: string[] }

export const isLanguage = (value: unknown): value is string =>
  typeof value === 'string' && value in LANGUAGE_NAMES

/** Aus `settings.languages` – fehlt es, nur Deutsch. */
export function siteLanguages(field: { default?: unknown; additional?: unknown } | null | undefined): SiteLanguages {
  const fallback = isLanguage(field?.default) ? field.default : 'de'
  const extra = Array.isArray(field?.additional) ? field.additional.filter(isLanguage) : []
  return { default: fallback, all: [...new Set([fallback, ...extra])] }
}

/** Sprachkürzel am Anfang der Adresse – noch ohne zu wissen, welche Sprachen die Website hat. */
export function languageFromPath(pathname = window.location.pathname): string | null {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(pathname)
  return match && isLanguage(match[1]) ? match[1] : null
}

/** Pfad ohne Sprachkürzel: `/en/contact` → `/contact`. */
export function stripLanguage(pathname: string, language: string, languages: SiteLanguages): string {
  if (language === languages.default) return pathname
  const rest = pathname.replace(new RegExp(`^/${language}(?=/|$)`), '')
  return rest || '/'
}

/** Präfix einer Sprache: '' für die Standardsprache, sonst `/en`. */
export function languagePrefix(language: string, languages: SiteLanguages): string {
  return language === languages.default ? '' : `/${language}`
}

/** Interne Adresse (`/kontakt`, `/#team`) in der Sprache – externe bleiben, wie sie sind. */
export function withLanguage(href: string, language: string, languages: SiteLanguages): string {
  const prefix = languagePrefix(language, languages)
  if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href
  if (new RegExp(`^/(${languages.all.join('|')})(?=/|$|#|\\?)`).test(href)) return href
  if (href === '/') return prefix
  return href.startsWith('/#') || href.startsWith('/?') ? `${prefix}${href.slice(1)}` : `${prefix}${href}`
}

type Doc = { id: number | string; slug?: string | null; language?: string | null; translationOf?: unknown }

const idOf = (value: unknown): string | null => {
  if (value && typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return typeof value === 'number' || typeof value === 'string' ? String(value) : null
}

/** Wurzel einer Übersetzungsgruppe: die Seite in der Standardsprache. */
export const translationRoot = (doc: Doc) => idOf(doc.translationOf) ?? String(doc.id)

/** Sprache eines Dokuments – leer heißt Standardsprache. */
export const docLanguage = (doc: Doc, languages: SiteLanguages) =>
  isLanguage(doc.language) && languages.all.includes(doc.language) ? doc.language : languages.default

/** Adresse einer Seite in ihrer Sprache. */
export function pageHref(page: Doc, languages: SiteLanguages): string {
  const path = !page.slug || page.slug === 'home' ? '/' : `/${page.slug}`
  return withLanguage(path, docLanguage(page, languages), languages)
}

export type LanguageLink = { code: string; label: string; href: string; current: boolean }

/**
 * Sprachumschalter: dieselbe Seite in jeder Sprache – gibt es sie dort nicht,
 * die Startseite dieser Sprache. Leer, wenn die Website nur eine Sprache hat.
 */
export function languageLinks(
  languages: SiteLanguages,
  current: string,
  pages: Doc[],
  page: Doc | null | undefined,
): LanguageLink[] {
  if (languages.all.length < 2) return []
  const root = page ? translationRoot(page) : null
  return languages.all.map((code) => {
    const match = root
      ? pages.find((entry) => translationRoot(entry) === root && docLanguage(entry, languages) === code)
      : null
    return {
      code,
      label: LANGUAGE_NAMES[code] || code.toUpperCase(),
      href: match ? pageHref(match, languages) : withLanguage('/', code, languages),
      current: code === current,
    }
  })
}

/**
 * Seite zur Adresse in der Sprache. Gibt es den Kurznamen nur in einer
 * anderen Sprache (z. B. ein Link `/en/kontakt` auf die deutsche Seite),
 * kommt deren Übersetzung zurück – mit der richtigen Adresse zum Umleiten.
 */
export function findPage<P extends Doc>(
  pages: P[],
  slug: string,
  language: string,
  languages: SiteLanguages,
): { page: P | null; redirect: string | null; reload: boolean } {
  const own = pages.find((page) => page.slug === slug && docLanguage(page, languages) === language)
  if (own) return { page: own, redirect: null, reload: false }
  const other = pages.find((page) => page.slug === slug)
  if (!other) return { page: null, redirect: null, reload: false }
  const root = translationRoot(other)
  const translated = pages.find(
    (page) => translationRoot(page) === root && docLanguage(page, languages) === language,
  )
  const target = translated || other
  // Andere Sprache: neu laden, damit Menü und Fußzeile mitwechseln.
  return { page: target, redirect: pageHref(target, languages), reload: !translated }
}

/* —— Feste Texte dieser Website (Kopf, Fuß, „Seite nicht gefunden“) ———— */

type Texts = Record<string, string>

/**
 * Was die Website selbst schreibt (nicht aus dem CMS): Überschriften im
 * Fuß, Menü-Knöpfe, Fehlerseite. Schlüssel ist der deutsche Text.
 */
const UI: Record<string, Texts> = {
  en: {
    'Seite nicht gefunden': 'Page not found', 'Zur Startseite': 'Back to the homepage',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'The content could not be loaded right now. Please try again later.',
    'Menü öffnen': 'Open menu', 'Menü schließen': 'Close menu', Menü: 'Menu', Hauptnavigation: 'Main navigation',
    Seiten: 'Pages', Kontakt: 'Contact', Rechtliches: 'Legal', Fußzeile: 'Footer', Adresse: 'Address',
    Öffnungszeiten: 'Opening hours', Entdecken: 'Discover', 'Suche öffnen': 'Open search', Gemeindeamt: 'Municipal office',
    Gemeinde: 'Municipality', Weingut: 'Winery', 'Alle Rechte vorbehalten.': 'All rights reserved.', Beiträge: 'Posts',
    "Zu": "Close",
    "Seite": "Page",
    "Beitrag": "Post",
    "Diese Seite ist momentan nicht verfügbar.": "This page is currently unavailable.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "The homepage is currently unavailable. Please try again in a few minutes.",
    "Impressum": "Legal notice",
    "Datenschutz": "Privacy",
    "Profil": "Profile",
  },
  fr: {
    'Seite nicht gefunden': 'Page introuvable', 'Zur Startseite': "Retour à l'accueil",
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': "Les contenus n'ont pas pu être chargés. Veuillez réessayer plus tard.",
    'Menü öffnen': 'Ouvrir le menu', 'Menü schließen': 'Fermer le menu', Menü: 'Menu', Hauptnavigation: 'Navigation principale',
    Seiten: 'Pages', Kontakt: 'Contact', Rechtliches: 'Mentions légales', Fußzeile: 'Pied de page', Adresse: 'Adresse',
    Öffnungszeiten: "Horaires d'ouverture", Entdecken: 'Découvrir', 'Suche öffnen': 'Ouvrir la recherche', Gemeindeamt: 'Mairie',
    Gemeinde: 'Commune', Weingut: 'Domaine viticole', 'Alle Rechte vorbehalten.': 'Tous droits réservés.', Beiträge: 'Articles',
    "Zu": "Fermer",
    "Seite": "Page",
    "Beitrag": "Article",
    "Diese Seite ist momentan nicht verfügbar.": "Cette page n'est pas disponible pour le moment.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "La page d'accueil est momentanément indisponible. Réessayez dans quelques minutes.",
    "Impressum": "Mentions légales",
    "Datenschutz": "Confidentialité",
    "Profil": "Profil",
  },
  it: {
    'Seite nicht gefunden': 'Pagina non trovata', 'Zur Startseite': 'Torna alla home',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Non è stato possibile caricare i contenuti. Riprova più tardi.',
    'Menü öffnen': 'Apri menu', 'Menü schließen': 'Chiudi menu', Menü: 'Menu', Hauptnavigation: 'Navigazione principale',
    Seiten: 'Pagine', Kontakt: 'Contatto', Rechtliches: 'Note legali', Fußzeile: 'Piè di pagina', Adresse: 'Indirizzo',
    Öffnungszeiten: 'Orari di apertura', Entdecken: 'Scopri', 'Suche öffnen': 'Apri ricerca', Gemeindeamt: 'Ufficio comunale',
    Gemeinde: 'Comune', Weingut: 'Cantina', 'Alle Rechte vorbehalten.': 'Tutti i diritti riservati.', Beiträge: 'Articoli',
    "Zu": "Chiudi",
    "Seite": "Pagina",
    "Beitrag": "Articolo",
    "Diese Seite ist momentan nicht verfügbar.": "Questa pagina al momento non è disponibile.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "La home page al momento non è raggiungibile. Riprova tra qualche minuto.",
    "Impressum": "Note legali",
    "Datenschutz": "Privacy",
    "Profil": "Profilo",
  },
  es: {
    'Seite nicht gefunden': 'Página no encontrada', 'Zur Startseite': 'Volver al inicio',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'No se han podido cargar los contenidos. Inténtalo de nuevo más tarde.',
    'Menü öffnen': 'Abrir menú', 'Menü schließen': 'Cerrar menú', Menü: 'Menú', Hauptnavigation: 'Navegación principal',
    Seiten: 'Páginas', Kontakt: 'Contacto', Rechtliches: 'Legal', Fußzeile: 'Pie de página', Adresse: 'Dirección',
    Öffnungszeiten: 'Horario de apertura', Entdecken: 'Descubrir', 'Suche öffnen': 'Abrir búsqueda', Gemeindeamt: 'Ayuntamiento',
    Gemeinde: 'Municipio', Weingut: 'Bodega', 'Alle Rechte vorbehalten.': 'Todos los derechos reservados.', Beiträge: 'Entradas',
    "Zu": "Cerrar",
    "Seite": "Página",
    "Beitrag": "Entrada",
    "Diese Seite ist momentan nicht verfügbar.": "Esta página no está disponible en este momento.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "La página de inicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.",
    "Impressum": "Aviso legal",
    "Datenschutz": "Privacidad",
    "Profil": "Perfil",
  },
  nl: {
    'Seite nicht gefunden': 'Pagina niet gevonden', 'Zur Startseite': 'Naar de homepage',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'De inhoud kon niet worden geladen. Probeer het later opnieuw.',
    'Menü öffnen': 'Menu openen', 'Menü schließen': 'Menu sluiten', Menü: 'Menu', Hauptnavigation: 'Hoofdnavigatie',
    Seiten: "Pagina's", Kontakt: 'Contact', Rechtliches: 'Juridisch', Fußzeile: 'Voettekst', Adresse: 'Adres',
    Öffnungszeiten: 'Openingstijden', Entdecken: 'Ontdekken', 'Suche öffnen': 'Zoeken openen', Gemeindeamt: 'Gemeentehuis',
    Gemeinde: 'Gemeente', Weingut: 'Wijndomein', 'Alle Rechte vorbehalten.': 'Alle rechten voorbehouden.', Beiträge: 'Berichten',
    "Zu": "Sluiten",
    "Seite": "Pagina",
    "Beitrag": "Bericht",
    "Diese Seite ist momentan nicht verfügbar.": "Deze pagina is momenteel niet beschikbaar.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "De homepage is momenteel niet bereikbaar. Probeer het over een paar minuten opnieuw.",
    "Impressum": "Colofon",
    "Datenschutz": "Privacy",
    "Profil": "Profiel",
  },
  pl: {
    'Seite nicht gefunden': 'Nie znaleziono strony', 'Zur Startseite': 'Do strony głównej',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Nie udało się załadować treści. Spróbuj ponownie później.',
    'Menü öffnen': 'Otwórz menu', 'Menü schließen': 'Zamknij menu', Menü: 'Menu', Hauptnavigation: 'Nawigacja główna',
    Seiten: 'Strony', Kontakt: 'Kontakt', Rechtliches: 'Informacje prawne', Fußzeile: 'Stopka', Adresse: 'Adres',
    Öffnungszeiten: 'Godziny otwarcia', Entdecken: 'Odkryj', 'Suche öffnen': 'Otwórz wyszukiwanie', Gemeindeamt: 'Urząd gminy',
    Gemeinde: 'Gmina', Weingut: 'Winnica', 'Alle Rechte vorbehalten.': 'Wszelkie prawa zastrzeżone.', Beiträge: 'Wpisy',
    "Zu": "Zamknij",
    "Seite": "Strona",
    "Beitrag": "Wpis",
    "Diese Seite ist momentan nicht verfügbar.": "Ta strona jest obecnie niedostępna.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "Strona główna jest chwilowo niedostępna. Spróbuj ponownie za kilka minut.",
    "Impressum": "Nota prawna",
    "Datenschutz": "Prywatność",
    "Profil": "Profil",
  },
  cs: {
    'Seite nicht gefunden': 'Stránka nenalezena', 'Zur Startseite': 'Na úvodní stránku',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Obsah se nepodařilo načíst. Zkuste to prosím později.',
    'Menü öffnen': 'Otevřít menu', 'Menü schließen': 'Zavřít menu', Menü: 'Menu', Hauptnavigation: 'Hlavní navigace',
    Seiten: 'Stránky', Kontakt: 'Kontakt', Rechtliches: 'Právní informace', Fußzeile: 'Zápatí', Adresse: 'Adresa',
    Öffnungszeiten: 'Otevírací doba', Entdecken: 'Objevte', 'Suche öffnen': 'Otevřít hledání', Gemeindeamt: 'Obecní úřad',
    Gemeinde: 'Obec', Weingut: 'Vinařství', 'Alle Rechte vorbehalten.': 'Všechna práva vyhrazena.', Beiträge: 'Příspěvky',
    "Zu": "Zavřít",
    "Seite": "Stránka",
    "Beitrag": "Příspěvek",
    "Diese Seite ist momentan nicht verfügbar.": "Tato stránka momentálně není dostupná.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "Úvodní stránka je momentálně nedostupná. Zkuste to prosím za pár minut.",
    "Impressum": "Tiráž",
    "Datenschutz": "Ochrana údajů",
    "Profil": "Profil",
  },
  sk: {
    'Seite nicht gefunden': 'Stránka sa nenašla', 'Zur Startseite': 'Na úvodnú stránku',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Obsah sa nepodarilo načítať. Skúste to prosím neskôr.',
    'Menü öffnen': 'Otvoriť menu', 'Menü schließen': 'Zavrieť menu', Menü: 'Menu', Hauptnavigation: 'Hlavná navigácia',
    Seiten: 'Stránky', Kontakt: 'Kontakt', Rechtliches: 'Právne informácie', Fußzeile: 'Päta stránky', Adresse: 'Adresa',
    Öffnungszeiten: 'Otváracie hodiny', Entdecken: 'Objavte', 'Suche öffnen': 'Otvoriť vyhľadávanie', Gemeindeamt: 'Obecný úrad',
    Gemeinde: 'Obec', Weingut: 'Vinárstvo', 'Alle Rechte vorbehalten.': 'Všetky práva vyhradené.', Beiträge: 'Príspevky',
    "Zu": "Zavrieť",
    "Seite": "Stránka",
    "Beitrag": "Príspevok",
    "Diese Seite ist momentan nicht verfügbar.": "Táto stránka momentálne nie je dostupná.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "Úvodná stránka je momentálne nedostupná. Skúste to prosím o pár minút.",
    "Impressum": "Impresum",
    "Datenschutz": "Ochrana údajov",
    "Profil": "Profil",
  },
  hu: {
    'Seite nicht gefunden': 'Az oldal nem található', 'Zur Startseite': 'Vissza a kezdőlapra',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'A tartalmat nem sikerült betölteni. Kérjük, próbálja újra később.',
    'Menü öffnen': 'Menü megnyitása', 'Menü schließen': 'Menü bezárása', Menü: 'Menü', Hauptnavigation: 'Főmenü',
    Seiten: 'Oldalak', Kontakt: 'Kapcsolat', Rechtliches: 'Jogi információk', Fußzeile: 'Lábléc', Adresse: 'Cím',
    Öffnungszeiten: 'Nyitvatartás', Entdecken: 'Fedezze fel', 'Suche öffnen': 'Keresés megnyitása', Gemeindeamt: 'Polgármesteri hivatal',
    Gemeinde: 'Község', Weingut: 'Borászat', 'Alle Rechte vorbehalten.': 'Minden jog fenntartva.', Beiträge: 'Bejegyzések',
    "Zu": "Bezár",
    "Seite": "Oldal",
    "Beitrag": "Bejegyzés",
    "Diese Seite ist momentan nicht verfügbar.": "Ez az oldal jelenleg nem érhető el.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "A kezdőlap jelenleg nem érhető el. Kérjük, próbálja újra néhány perc múlva.",
    "Impressum": "Impresszum",
    "Datenschutz": "Adatvédelem",
    "Profil": "Profil",
  },
  sl: {
    'Seite nicht gefunden': 'Stran ni najdena', 'Zur Startseite': 'Na domačo stran',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Vsebine ni bilo mogoče naložiti. Poskusite znova pozneje.',
    'Menü öffnen': 'Odpri meni', 'Menü schließen': 'Zapri meni', Menü: 'Meni', Hauptnavigation: 'Glavna navigacija',
    Seiten: 'Strani', Kontakt: 'Kontakt', Rechtliches: 'Pravno', Fußzeile: 'Noga strani', Adresse: 'Naslov',
    Öffnungszeiten: 'Delovni čas', Entdecken: 'Odkrijte', 'Suche öffnen': 'Odpri iskanje', Gemeindeamt: 'Občinska uprava',
    Gemeinde: 'Občina', Weingut: 'Vinska klet', 'Alle Rechte vorbehalten.': 'Vse pravice pridržane.', Beiträge: 'Objave',
    "Zu": "Zapri",
    "Seite": "Stran",
    "Beitrag": "Objava",
    "Diese Seite ist momentan nicht verfügbar.": "Ta stran trenutno ni na voljo.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "Domača stran trenutno ni dosegljiva. Poskusite znova čez nekaj minut.",
    "Impressum": "Impresum",
    "Datenschutz": "Zasebnost",
    "Profil": "Profil",
  },
  hr: {
    'Seite nicht gefunden': 'Stranica nije pronađena', 'Zur Startseite': 'Na početnu stranicu',
    'Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.': 'Sadržaj nije bilo moguće učitati. Pokušajte ponovno kasnije.',
    'Menü öffnen': 'Otvori izbornik', 'Menü schließen': 'Zatvori izbornik', Menü: 'Izbornik', Hauptnavigation: 'Glavna navigacija',
    Seiten: 'Stranice', Kontakt: 'Kontakt', Rechtliches: 'Pravne informacije', Fußzeile: 'Podnožje', Adresse: 'Adresa',
    Öffnungszeiten: 'Radno vrijeme', Entdecken: 'Otkrijte', 'Suche öffnen': 'Otvori pretraživanje', Gemeindeamt: 'Općinski ured',
    Gemeinde: 'Općina', Weingut: 'Vinarija', 'Alle Rechte vorbehalten.': 'Sva prava pridržana.', Beiträge: 'Objave',
    "Zu": "Zatvori",
    "Seite": "Stranica",
    "Beitrag": "Objava",
    "Diese Seite ist momentan nicht verfügbar.": "Ova stranica trenutno nije dostupna.",
    "Die Startseite ist gerade nicht erreichbar. Bitte versuch es in ein paar Minuten noch einmal.": "Početna stranica trenutno nije dostupna. Pokušajte ponovno za nekoliko minuta.",
    "Impressum": "Impresum",
    "Datenschutz": "Privatnost",
    "Profil": "Profil",
  },
}

let uiLanguage = 'de'

/** Sprache der festen Texte – setzt der CMS-Anschluss nach dem Laden. */
export function setUiLanguage(language: string) {
  uiLanguage = language
}

/** Fester Text der Website in der Sprache der Seite (Deutsch, wenn unbekannt). */
export function t(text: string): string {
  return UI[uiLanguage]?.[text] ?? text
}

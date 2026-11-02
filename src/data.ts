// Alle Inhalte der Seite an einer Stelle. Platzhalter (Tiere, Adresse, IBAN, Termine)
// hier anpassen – oder später aus dem CMS laden.

export const org = {
  name: 'Tierschutzverein',
  street: 'Am Tierheim 3',
  city: '4020 Linz',
  phone: '+43 732 123 456',
  emergency: '+43 664 123 45 67',
  email: 'kontakt@tierschutzverein.example',
  iban: 'AT00 0000 0000 0000 0000',
  bic: 'ABCDATWW',
  hours: [
    { days: 'Mi – Fr', time: '14:00 – 17:00' },
    { days: 'Sa', time: '10:00 – 15:00' },
    { days: 'Mo, Di, So', time: 'nach Vereinbarung' },
  ],
}

export const navItems = [
  { label: 'Tiere', href: '#tiere' },
  { label: 'Mithelfen', href: '#mithelfen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Aktuelles', href: '#aktuelles' },
  { label: 'Kontakt', href: '#kontakt' },
]

export type Species = 'Hund' | 'Katze' | 'Kleintier'

export type Animal = {
  id: string
  name: string
  species: Species
  breed: string
  sex: 'weiblich' | 'männlich'
  age: string
  image: string
  traits: string[]
  story: string
  urgent?: boolean
}

export const animals: Animal[] = [
  {
    id: 'bello',
    name: 'Bello',
    species: 'Hund',
    breed: 'Terrier-Mix',
    sex: 'männlich',
    age: '4 Jahre',
    image: '/images/bello.jpg',
    traits: ['verträglich', 'verspielt', 'kinderlieb'],
    story: 'Bello wurde an einer Raststätte gefunden. Er liebt lange Spaziergänge und lernt schnell.',
  },
  {
    id: 'mimi',
    name: 'Mimi',
    species: 'Katze',
    breed: 'Europäisch Kurzhaar',
    sex: 'weiblich',
    age: '2 Jahre',
    image: '/images/mimi.jpg',
    traits: ['verschmust', 'Freigang', 'ruhig'],
    story: 'Mimi braucht ein paar Tage, um aufzutauen – dann weicht sie nicht mehr von deiner Seite.',
  },
  {
    id: 'hoppel',
    name: 'Hoppel & Flocke',
    species: 'Kleintier',
    breed: 'Zwergkaninchen',
    sex: 'männlich',
    age: '1 Jahr',
    image: '/images/hoppel.jpg',
    traits: ['nur zu zweit', 'Außengehege', 'neugierig'],
    story: 'Die zwei sind unzertrennlich und suchen ein großes Gehege mit viel Auslauf.',
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'Hund',
    breed: 'Australian-Shepherd-Mix',
    sex: 'weiblich',
    age: '3 Jahre',
    image: '/images/luna.jpg',
    traits: ['aktiv', 'gelehrig', 'Hundeerfahrung'],
    story: 'Luna braucht Beschäftigung und Menschen, die gerne draußen sind – Agility wäre ein Traum.',
  },
  {
    id: 'felix',
    name: 'Felix',
    species: 'Katze',
    breed: 'Maine-Coon-Mix',
    sex: 'männlich',
    age: '6 Jahre',
    image: '/images/felix.jpg',
    traits: ['gemütlich', 'Wohnungskatze', 'Senior-tauglich'],
    story: 'Felix ist ein sanfter Riese, der am liebsten am Fensterbrett die Vögel beobachtet.',
  },
  {
    id: 'rex',
    name: 'Rex',
    species: 'Hund',
    breed: 'Schäferhund-Mix',
    sex: 'männlich',
    age: '8 Jahre',
    image: '/images/rex.jpg',
    traits: ['treu', 'ruhig', 'Einzelhund'],
    story: 'Rex wartet schon über ein Jahr. Ein ruhiges Zuhause für seinen Lebensabend – das wär’s.',
    urgent: true,
  },
  {
    id: 'schneeflocke',
    name: 'Schneeflocke',
    species: 'Kleintier',
    breed: 'Kaninchen',
    sex: 'weiblich',
    age: '2 Jahre',
    image: '/images/schneeflocke.jpg',
    traits: ['zutraulich', 'Partnertier gesucht'],
    story: 'Schneeflocke sucht ein Zuhause, in dem schon ein kastrierter Kaninchenbub wartet.',
  },
  {
    id: 'kruemel',
    name: 'Krümel',
    species: 'Kleintier',
    breed: 'Goldhamster',
    sex: 'weiblich',
    age: '8 Monate',
    image: '/images/kruemel.jpg',
    traits: ['nachtaktiv', 'Einzelhaltung'],
    story: 'Krümel ist abends richtig munter und braucht ein großes, gut eingestreutes Gehege.',
  },
]

export const donationAmounts = [10, 25, 50, 100]

export const helpOptions = [
  { title: 'Patenschaft', text: 'Ab 15 € im Monat übernimmst du Futter und Tierarzt für ein Tier, das schwer vermittelbar ist.' },
  { title: 'Gassigehen', text: 'Komm am Wochenende vorbei und schenk unseren Hunden Bewegung und Abwechslung.' },
  { title: 'Pflegestelle', text: 'Nimm ein Tier auf Zeit bei dir auf – besonders Katzenbabys und Senioren brauchen das.' },
  { title: 'Sachspenden', text: 'Decken, Futter, Katzenstreu und Spielzeug sind jederzeit willkommen.' },
]

export const stats = [
  { value: '312', label: 'Tiere vermittelt im letzten Jahr' },
  { value: '85', label: 'Ehrenamtliche helfen regelmäßig' },
  { value: '40+', label: 'Jahre Tierschutz in der Region' },
  { value: '100 %', label: 'der Spenden für die Tiere' },
]

export const news = [
  { date: '2026-10-24', title: 'Neues Katzenhaus eröffnet', text: 'Dank eurer Spenden haben unsere Katzen jetzt doppelt so viel Platz – mit Freigehege und Kuschelecken.' },
  { date: '2026-10-08', title: 'Tag der offenen Tür', text: 'Über 600 Besucher:innen, 14 neue Pat:innen und viele glückliche Hunde nach der Gassirunde.' },
  { date: '2026-09-15', title: 'Winterfutter-Aktion startet', text: 'Bis Jahresende sammeln wir Futter für die Wintermonate. Abgabe jederzeit zu den Öffnungszeiten.' },
]

import { linkUrl, type SiteBundle } from './client'

/** Ein Link, wie Navigation und Footer ihn brauchen. */
export type NavItem = { label: string; href: string }

export type FooterData = {
  nav: NavItem[]
  legal: NavItem[]
  copyright: string | null
  claim: string | null
  address: string[]
  phone: string | null
  email: string | null
}

/** Menüpunkte und Button rechts aus dem CMS-Header. Untermenüs werden flach angehängt. */
export function navFromCms(site: SiteBundle): { items: NavItem[]; cta: NavItem | null } {
  const items: NavItem[] = []
  for (const item of site.header?.navItems || []) {
    const href = linkUrl(item)
    if (href && item.label) items.push({ label: item.label, href })
    for (const child of item.children || []) {
      const childHref = linkUrl(child)
      if (childHref && child.label) items.push({ label: child.label, href: childHref })
    }
  }
  const cta = site.header?.cta
  const ctaHref = cta?.enabled ? linkUrl(cta) : null
  return { items, cta: ctaHref && cta?.label ? { label: cta.label, href: ctaHref } : null }
}

/** Footer: Links aus dem CMS-Footer, Kontakt und Slogan aus den Website-Einstellungen. */
export function footerFromCms(site: SiteBundle, nav: NavItem[]): FooterData {
  const contact = site.settings?.contact
  const copyright = site.footer?.copyright?.trim() || null
  return {
    nav,
    legal: (site.footer?.navItems || []).filter((l) => l.label && l.url).map((l) => ({ label: l.label, href: l.url })),
    // „©“ am Anfang um das aktuelle Jahr ergänzen, damit es nicht veraltet.
    copyright: copyright ? copyright.replace(/^©\s*(?!\d)/, `© ${new Date().getFullYear()} `) : null,
    claim: site.settings?.tagline || null,
    address: (contact?.address || '').split('\n').map((l) => l.trim()).filter(Boolean),
    phone: contact?.phone || null,
    email: contact?.email || null,
  }
}

/** Seitentitel und Beschreibung aus dem CMS setzen. */
export function applyMeta(site: SiteBundle, title?: string | null, description?: string | null) {
  const name = site.settings?.siteName || ''
  const seo = site.settings?.seo
  document.title = title && title !== 'Startseite' ? `${title} – ${name}` : seo?.metaTitle || name || document.title
  const meta = document.querySelector('meta[name="description"]')
  const text = description || seo?.metaDescription
  if (meta && text) meta.setAttribute('content', text)
}

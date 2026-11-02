import { useEffect, useState } from 'react'
import { loadBlocksRuntime } from './blocksRuntime'
import { isCmsEnabled, loadSite, type SiteBundle } from './client'

/** So lange wartet die Website höchstens auf das CMS, dann zeigt sie ihre eingebauten Inhalte. */
const TIMEOUT_MS = 8000

export type CmsState =
  | { status: 'loading' }
  | { status: 'ready'; site: SiteBundle }
  | { status: 'off'; reason?: string }

/**
 * Lädt die Inhalte aus dem CMS. Ist das CMS abgeschaltet, nicht erreichbar
 * oder kennt es den Kunden nicht, meldet der Hook `off` – die Website zeigt
 * dann ihre eingebauten Inhalte, statt leer zu bleiben.
 */
export function useCmsSite(): CmsState {
  const [state, setState] = useState<CmsState>(() => (isCmsEnabled() ? { status: 'loading' } : { status: 'off' }))

  useEffect(() => {
    if (!isCmsEnabled()) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    // Laufzeit parallel zu den Daten anfordern.
    loadBlocksRuntime().catch(() => {})
    loadSite(controller.signal)
      .then((site) => {
        if (!site.pages.length) throw new Error('Im CMS sind noch keine veröffentlichten Seiten.')
        setState({ status: 'ready', site })
      })
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : String(error)
        console.info(`[cms] Eingebaute Inhalte aktiv: ${reason}`)
        setState({ status: 'off', reason })
      })
      .finally(() => window.clearTimeout(timer))
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [])

  return state
}

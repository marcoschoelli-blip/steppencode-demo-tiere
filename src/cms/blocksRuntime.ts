import { getCmsUrl } from './client'

/**
 * Block-Laufzeit des CMS laden.
 *
 * Diese Website rendert die Sektionen aus dem Seiten-Baukasten nicht selbst.
 * Das CMS liefert dafür ein Skript samt Stylesheet aus (`/runtime/sc-blocks.js`
 * und `.css`), gebaut aus demselben Code wie seine Live-Vorschau. Kommen dort
 * neue Blöcke, Elemente oder Funktionen dazu, sind sie mit dem nächsten
 * CMS-Deploy auch hier – ohne dass diese Website neu gebaut werden muss.
 *
 * Vertrag: `window.SteppencodeBlocks` mit `apiVersion` 1 (siehe README des
 * CMS, „Frontends anbinden“). Hier steht bewusst nichts über einzelne Blöcke.
 */

export type MountHandle<P> = {
  update: (next: Partial<P>) => void
  unmount: () => void
}

export type BlocksMountProps = {
  blocks?: unknown[] | null
  cmsUrl?: string
  tenantId?: string
  pageBasePath?: string
  postBasePath?: string
  posts?: unknown[]
}

export type RichTextMountProps = {
  content?: unknown
  cmsUrl?: string
  className?: string
}

export type BlocksRuntime = {
  apiVersion: number
  build: string
  mountBlocks: (element: Element, props: BlocksMountProps) => MountHandle<BlocksMountProps>
  mountRichText: (element: Element, props: RichTextMountProps) => MountHandle<RichTextMountProps>
}

declare global {
  interface Window {
    SteppencodeBlocks?: BlocksRuntime
  }
}

/** Diese Website spricht Version 1 des Vertrags. */
const SUPPORTED_API = 1
const TIMEOUT_MS = 20_000

let pending: Promise<BlocksRuntime> | null = null

function runtimeUrl(file: string) {
  return `${getCmsUrl()}/runtime/${file}`
}

/** Stylesheet als erstes im <head>: Das Theme dieser Website kommt danach und gewinnt. */
function loadStylesheet(): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>('link[data-sc-blocks]')
    if (existing) {
      if (existing.sheet) resolve()
      else {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => resolve(), { once: true })
      }
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = runtimeUrl('sc-blocks.css')
    link.dataset.scBlocks = ''
    // Fehlt das Stylesheet, trotzdem weitermachen: Inhalte ohne Gestaltung
    // sind besser als gar keine.
    link.addEventListener('load', () => resolve(), { once: true })
    link.addEventListener('error', () => resolve(), { once: true })
    document.head.prepend(link)
  })
}

function loadScript(): Promise<BlocksRuntime> {
  return new Promise((resolve, reject) => {
    if (window.SteppencodeBlocks) {
      resolve(window.SteppencodeBlocks)
      return
    }
    const script = document.createElement('script')
    script.src = runtimeUrl('sc-blocks.js')
    script.async = true
    script.dataset.scBlocks = ''
    script.addEventListener('load', () => {
      if (window.SteppencodeBlocks) resolve(window.SteppencodeBlocks)
      else reject(new Error('Block-Laufzeit geladen, aber nicht initialisiert.'))
    })
    script.addEventListener('error', () => reject(new Error(`Block-Laufzeit nicht erreichbar: ${script.src}`)))
    document.head.append(script)
  })
}

/**
 * Lädt Skript und Stylesheet genau einmal. Früh aufrufen (main.tsx), damit
 * beides parallel zu den Seitendaten kommt.
 */
export function loadBlocksRuntime(): Promise<BlocksRuntime> {
  if (pending) return pending
  const attempt = Promise.all([loadScript(), loadStylesheet()]).then(([runtime]) => {
    if (runtime.apiVersion !== SUPPORTED_API) {
      console.warn(
        `[blocks] Block-Laufzeit spricht API ${runtime.apiVersion}, diese Website ${SUPPORTED_API}.`,
      )
    }
    return runtime
  })
  const timeout = new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error('Block-Laufzeit: Zeitüberschreitung')), TIMEOUT_MS)
  })
  pending = Promise.race([attempt, timeout]).catch((error) => {
    // Beim nächsten Seitenaufruf neu versuchen statt dauerhaft zu scheitern.
    pending = null
    throw error
  })
  return pending
}

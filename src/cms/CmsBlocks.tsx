import { useEffect, useRef, useState } from 'react'
import { loadBlocksRuntime } from './blocksRuntime'
import { getCmsUrl } from './client'

/**
 * Sektionen einer Seite aus dem CMS – gerendert von dessen Block-Laufzeit.
 * Diese Komponente reicht die Daten nur durch; welche Blöcke es gibt und wie
 * sie grundsätzlich aussehen, weiß allein das CMS. Die Gestaltung dieser
 * Website legt theme/blocks.theme.css darüber.
 */
export function CmsBlocks({
  blocks,
  posts,
  tenantId,
  onRendered,
  locale,
  basePath = '',
}: {
  blocks: unknown[]
  posts?: unknown[]
  tenantId: string
  /** Sprache der Seite – feste Texte der Blöcke, Datums- und Zahlenformate. */
  locale?: string
  /** Präfix der Sprache (`/en`), leer für die Standardsprache. */
  basePath?: string
  onRendered?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const rendered = useRef(onRendered)
  useEffect(() => {
    rendered.current = onRendered
  }, [onRendered])

  useEffect(() => {
    let cancelled = false
    let unmount: (() => void) | undefined
    loadBlocksRuntime()
      .then((runtime) => {
        if (cancelled || !ref.current) return
        unmount = runtime.mountBlocks(ref.current, {
          blocks,
          cmsUrl: getCmsUrl(),
          tenantId,
          pageBasePath: basePath || '/',
          postBasePath: `${basePath}/beitraege`,
          posts,
          locale,
        }).unmount
        setState('ready')
        window.requestAnimationFrame(() => rendered.current?.())
      })
      .catch((error) => {
        console.error('[blocks]', error)
        if (!cancelled) setState('failed')
      })
    return () => {
      cancelled = true
      unmount?.()
    }
  }, [blocks, posts, tenantId, locale, basePath])

  return (
    <>
      {state === 'failed' ? (
        <p className="cms-error">Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.</p>
      ) : null}
      <div data-state={state} ref={ref} style={state === 'loading' ? { minHeight: '100vh' } : undefined} />
    </>
  )
}

/** Fließtext (z. B. ein Beitrag) – ebenfalls von der Block-Laufzeit gerendert. */
export function CmsRichText({ content, className }: { content: unknown; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false
    let unmount: (() => void) | undefined
    loadBlocksRuntime()
      .then((runtime) => {
        if (cancelled || !ref.current) return
        unmount = runtime.mountRichText(ref.current, { content, cmsUrl: getCmsUrl(), className }).unmount
      })
      .catch((error) => console.error('[blocks]', error))
    return () => {
      cancelled = true
      unmount?.()
    }
  }, [content, className])
  return <div ref={ref} />
}

/** Nach dem Rendern zur Sprungmarke aus der Adresse springen (z. B. /#kontakt). */
export function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (id) document.getElementById(id)?.scrollIntoView()
}

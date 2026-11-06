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
}: {
  blocks: unknown[]
  posts?: unknown[]
  tenantId: string
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
          pageBasePath: '/',
          postBasePath: '/beitraege',
          posts,
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
  }, [blocks, posts, tenantId])

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

type PostRoot = 'post' | 'list'

/**
 * Beitragsseite (`/beitraege/<slug>`) und Übersicht (`/beitraege`) – beides
 * zeichnet die Block-Laufzeit des CMS, für alle Websites gleich und im
 * Theme dieser Website. Diese hier gibt nur Kopf und Fuß dazu.
 */
function CmsPostRoot({
  kind,
  post,
  posts,
  slug,
  tenantId,
  title,
}: {
  kind: PostRoot
  post?: unknown
  posts?: unknown[]
  slug?: string
  tenantId: string
  title?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    let cancelled = false
    let unmount: (() => void) | undefined
    loadBlocksRuntime()
      .then((runtime) => {
        if (cancelled || !ref.current) return
        const common = { cmsUrl: getCmsUrl(), tenantId, pageBasePath: '/', postBasePath: '/beitraege', posts }
        if (kind === 'post' && runtime.mountPost) {
          unmount = runtime.mountPost(ref.current, { ...common, post, slug }).unmount
        } else if (kind === 'list' && runtime.mountPostList) {
          unmount = runtime.mountPostList(ref.current, { ...common, title }).unmount
        } else if (kind === 'post') {
          // Ältere Laufzeit: nur der Text.
          const content = post && typeof post === 'object' ? (post as { content?: unknown }).content : null
          unmount = runtime.mountRichText(ref.current, { content, cmsUrl: common.cmsUrl }).unmount
        } else {
          unmount = runtime.mountBlocks(ref.current, {
            ...common,
            blocks: [{ blockType: 'latestPosts', layout: 'grid', columns: '3', limit: 9, pagination: 'pages' }],
          }).unmount
        }
        setState('ready')
      })
      .catch((error) => {
        console.error('[blocks]', error)
        if (!cancelled) setState('failed')
      })
    return () => {
      cancelled = true
      unmount?.()
    }
  }, [kind, post, posts, slug, tenantId, title])

  return (
    <>
      {state === 'failed' ? (
        <p className="cms-error">Die Inhalte konnten gerade nicht geladen werden. Bitte später erneut versuchen.</p>
      ) : null}
      <div ref={ref} style={state === 'loading' ? { minHeight: '60vh' } : undefined} />
    </>
  )
}

export function CmsPost(props: { post?: unknown; posts?: unknown[]; slug: string; tenantId: string }) {
  return <CmsPostRoot kind="post" {...props} />
}

export function CmsPostList(props: { posts?: unknown[]; tenantId: string; title?: string }) {
  return <CmsPostRoot kind="list" {...props} />
}

import { useEffect } from 'react'
import { CmsBlocks, CmsPost, CmsPostList, scrollToHash } from './cms/CmsBlocks'
import { applyMeta, footerFromCms, navFromCms } from './cms/chrome'
import { currentPath, type SiteBundle } from './cms/client'
import { useCmsSite } from './cms/useCmsSite'
import { About } from './components/About'
import { Animals } from './components/Animals'
import { Contact } from './components/Contact'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Help } from './components/Help'
import { Hero } from './components/Hero'
import { News } from './components/News'

export default function App() {
  const cms = useCmsSite()
  if (cms.status === 'loading') return <div className="app-loading" aria-busy="true" />
  if (cms.status === 'ready') return <CmsSite site={cms.site} />
  return <BuiltInSite />
}

/** Inhalte aus dem CMS: Navigation, Footer und Seiten – im Editor des CMS pflegbar. */
function CmsSite({ site }: { site: SiteBundle }) {
  const path = currentPath()
  const page = site.pages.find((p) => p.slug === path)
  // Beiträge: Übersicht und eigene Seite – sofern keine CMS-Seite so heißt.
  const postSlug = !page && path.startsWith('beitraege/') ? path.slice('beitraege/'.length) : null
  const post = postSlug ? site.posts.find((p) => p.slug === postSlug) : undefined
  const postList = !page && path === 'beitraege'
  const { items, cta } = navFromCms(site)

  useEffect(() => {
    applyMeta(
      site,
      post?.title ?? (postList ? 'Beiträge' : page?.title) ?? 'Seite nicht gefunden',
      post?.excerpt ?? page?.excerpt,
    )
  }, [site, page, post, postList])

  return (
    <>
      <Header items={items} cta={cta} />
      <main className="sc-page" id="top">
        {postSlug ? (
          <CmsPost post={post} posts={site.posts} slug={postSlug} tenantId={site.tenantId} />
        ) : postList ? (
          <CmsPostList posts={site.posts} tenantId={site.tenantId} />
        ) : page ? (
          <CmsBlocks blocks={page.layout || []} onRendered={scrollToHash} posts={site.posts} tenantId={site.tenantId} />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer data={footerFromCms(site, items)} />
    </>
  )
}

function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <h1>Seite nicht gefunden</h1>
        <p>
          <a className="link-underline" href="/">
            Zur Startseite
          </a>
        </p>
      </div>
    </section>
  )
}

/** Eingebaute Inhalte – wenn das CMS abgeschaltet oder nicht erreichbar ist. */
function BuiltInSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Animals />
        <Help />
        <About />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

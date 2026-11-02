import { useEffect } from 'react'
import { CmsBlocks, CmsRichText, scrollToHash } from './cms/CmsBlocks'
import { applyMeta, footerFromCms, navFromCms } from './cms/chrome'
import { currentPath, mediaUrl, type Post, type SiteBundle } from './cms/client'
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
  const post = path.startsWith('beitraege/') ? site.posts.find((p) => `beitraege/${p.slug}` === path) : undefined
  const { items, cta } = navFromCms(site)

  useEffect(() => {
    applyMeta(site, post?.title ?? page?.title ?? 'Seite nicht gefunden', post?.excerpt ?? page?.excerpt)
  }, [site, page, post])

  return (
    <>
      <Header items={items} cta={cta} />
      <main className="sc-page" id="top">
        {post ? (
          <PostView post={post} />
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

const dateFormat = new Intl.DateTimeFormat('de-AT', { day: 'numeric', month: 'long', year: 'numeric' })

/** Beitrag aus „Aktuelles“ – Text gerendert von der Block-Laufzeit. */
function PostView({ post }: { post: Post }) {
  const image = mediaUrl(post.featuredImage)
  return (
    <article className="section post-view">
      <div className="container post-view__inner">
        <a className="link-underline post-view__back" href="/#aktuelles">
          Zurück zu Aktuelles
        </a>
        {post.publishedAt ? <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time> : null}
        <h1>{post.title}</h1>
        {image ? <img alt="" className="post-view__image" src={image} /> : null}
        <CmsRichText className="post-view__text" content={post.content} />
      </div>
    </article>
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

import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16 lg:pt-20`}>
        <div className="grid gap-8 rounded-[2.5rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="rounded-[2rem] bg-[var(--slot4-dark-bg)] p-7 text-white sm:p-10">
            <p className={`${dc.type.eyebrow} text-white/60`}>{voice.eyebrow}</p>
            <h1 className={`${dc.type.heroTitle} mt-4 max-w-4xl`}>{voice.headline}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{voice.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {voice.chips.map((chip) => <span key={chip} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{chip}</span>)}
            </div>
          </div>
          <form action={basePath} className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5 sm:p-6">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{voice.filterLabel}</p>
            <select name="category" defaultValue={category || 'all'} className="mt-4 h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm font-black outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 text-sm font-black text-white transition hover:-translate-y-0.5">
              Filter <ArrowRight className="h-4 w-4" />
            </button>
            <p className={`mt-4 rounded-[1.4rem] border border-black/10 bg-white p-4 text-sm leading-7 ${pal.mutedText}`}>{voice.secondaryNote}</p>
          </form>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id || post.slug || index} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/15 bg-white p-10 text-center">
            <h2 className="text-3xl font-black tracking-[-0.06em]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>Try another category or return to the full archive.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className="grid gap-6 rounded-[2.5rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black">
              <ChevronLeft className="h-4 w-4" /> Articles
            </Link>
            <p className={`${dc.type.eyebrow} mt-8 ${pal.accentText}`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-7xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
            <p className={`mt-5 max-w-3xl text-base leading-8 ${pal.mutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
          </div>
          <aside className="rounded-[2rem] bg-[var(--slot4-dark-bg)] p-6 text-white">
            <p className={`${dc.type.eyebrow} text-white/60`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/76">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}

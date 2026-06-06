import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, FileCard, BookmarkTileCard, ImageHeroCard, CompactIndexCard } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const isFeatured = index % 6 === 0

  if (task === 'pdf') return <FileCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkTileCard post={post} href={href} />
  if (task === 'image') return <ImageHeroCard post={post} href={href} />

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,21,15,0.12)] ${isFeatured ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt={post.title || ''} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,15,0.06),rgba(24,21,15,0.78))]" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <h2 className="mt-4 line-clamp-3 text-2xl font-black leading-[0.95] tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-black/60">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] opacity-70 group-hover:opacity-100">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 rounded-[2.5rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="rounded-[2rem] bg-[var(--slot4-dark-bg)] p-7 text-white sm:p-10">
            <p className={`${dc.type.eyebrow} text-white/60`}>{pagesContent.search.hero.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-4 max-w-4xl`}>{pagesContent.search.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{pagesContent.search.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">Documents</span>
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">Topics</span>
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">Categories</span>
            </div>
          </div>
          <form action="/search" className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5 sm:p-6">
            <input type="hidden" name="master" value="1" />
            <label className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3">
              <Search className="h-5 w-5 opacity-45" />
              <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3">
                <Filter className="h-4 w-4 opacity-45" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
              </label>
              <select name="task" defaultValue={task} className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-black outline-none">
                <option value="">All content types</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </div>
            <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-sm font-black text-white transition hover:-translate-y-0.5" type="submit">
              Search <ArrowRight className="h-4 w-4" />
            </button>
            <div className="mt-4 rounded-[1.5rem] border border-black/10 bg-white p-4">
              <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{results.length} results</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.06em]">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
          </form>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.length ? (
            results.map((post, index) => <SearchResultCard key={post.id || post.slug || index} post={post} index={index} />)
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-black/15 bg-white p-10 text-center">
              <p className="text-2xl font-black tracking-[-0.05em]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-7 text-black/60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">
            Browse latest <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </EditableSiteShell>
  )
}

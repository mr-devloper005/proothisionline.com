import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Building2, Camera, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound, Bookmark, Download, BriefcaseBusiness } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, getEditableCategory, getEditableExcerpt, postHref, ArticleListCard, FileCard, ImageHeroCard, BookmarkTileCard, EditorialFeatureCard, CompactIndexCard } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const archiveVars = {
    '--archive-bg': '#f8f3e7',
    '--archive-text': '#18150f',
    '--archive-surface': '#fffdf6',
  } as CSSProperties
  const pagePosts = posts.length ? posts : []

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[2.5rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
            <div className="rounded-[2rem] bg-[var(--slot4-dark-bg)] p-7 text-white sm:p-10">
              <p className={`${dc.type.eyebrow} text-white/60`}>{voice.eyebrow}</p>
              <h1 className={`${dc.type.heroTitle} mt-4 max-w-4xl`}>{voice.headline || `Browse ${label}`}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{voice.description || SITE_CONFIG.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {voice.chips.map((chip) => <span key={chip} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">{chip}</span>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
                  Search posts
                </Link>
              </div>
            </div>

            <form action={basePath} className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] opacity-55">
                <Filter className="h-4 w-4" /> Filter
              </div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm font-black outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 text-sm font-black text-white transition hover:-translate-y-0.5">
                Apply <ArrowRight className="h-4 w-4" />
              </button>
              <div className="mt-5 rounded-[1.4rem] border border-black/10 bg-white p-4">
                <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Showing</p>
                <p className="mt-2 text-sm font-bold">{categoryLabel}</p>
                <p className={`mt-2 text-sm leading-7 ${pal.mutedText}`}>{voice.secondaryNote}</p>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-8">
          {pagePosts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pagePosts.map((post, index) => <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">No posts found</h2>
              <p className="mt-2 text-sm leading-7 text-black/60">Try another category or refresh after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return <ArticleListCard post={post} href={href} index={index} />
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const content = getContent(post)
  const location = asText(content.location) || asText(content.address) || asText(content.city)
  const phone = asText(content.phone) || asText(content.telephone) || asText(content.mobile)
  const website = asText(content.website) || asText(content.url)
  const logo = getEditablePostImage(post)
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,21,15,0.12)] sm:grid-cols-[120px_minmax(0,1fr)]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-page-bg)] ring-1 ring-black/10">
        {logo ? <img src={logo} alt={post.title || ''} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/60">{getEditableExcerpt(post, 140)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-black/65 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const content = getContent(post)
  const price = asText(content.price) || asText(content.amount) || asText(content.budget)
  const location = asText(content.location) || asText(content.address) || asText(content.city)
  const condition = asText(content.condition) || asText(content.type) || asText(content.availability)
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,21,15,0.12)]">
      <div className="grid min-h-64 sm:grid-cols-[0.75fr_1fr]">
        <div className="relative bg-[var(--slot4-dark-bg)] p-5 text-white">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Notice</span>
          <h2 className="mt-10 text-3xl font-black leading-[0.96] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/72">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title || ''} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/60">{getEditableExcerpt(post, 165)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">View notice <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return <ImageHeroCard post={post} href={href} />
}

function BookmarkArchiveCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return <BookmarkTileCard post={post} href={href} />
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return <FileCard post={post} href={href} />
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getEditablePostImage(post)
  const content = getContent(post)
  const role = asText(content.role) || asText(content.designation) || asText(content.company) || asText(content.location)
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-[0_18px_46px_rgba(24,21,15,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,21,15,0.12)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)] ring-1 ring-black/10">
        {avatar ? <img src={avatar} alt={post.title || ''} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/60">{getEditableExcerpt(post, 150)}</p>
    </Link>
  )
}


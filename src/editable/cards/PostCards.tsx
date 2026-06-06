import Link from 'next/link'
import { ArrowRight, Bookmark, Clock3, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

function safeContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

export function getEditablePostImage(post?: SitePost | null) {
  const content = safeContent(post)
  const media = Array.isArray(post?.media) ? post?.media : []
  let mediaUrl = ''
  for (const item of media) {
    if (typeof item?.url === 'string' && item.url.trim()) {
      mediaUrl = item.url
      break
    }
  }
  const images = Array.isArray(content.images) ? content.images.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : []
  let singleImage = ''
  for (const key of ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) {
      singleImage = value
      break
    }
  }
  return mediaUrl || images[0] || singleImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = safeContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = safeContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Library pick'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,15,0.04),rgba(24,21,15,0.9))]" />
      <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 sm:p-8 lg:min-h-[640px] lg:p-10">
        <span className={`${dc.type.eyebrow} text-white/70`}>{label}</span>
        <h3 className="mt-4 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.07em] text-white sm:text-5xl lg:text-7xl">{post.title}</h3>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">
          Read document <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block w-[180px] shrink-0 overflow-hidden rounded-[1.7rem] border ${pal.border} bg-white p-3 ${dc.motion.lift} sm:w-[210px]`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)] shadow-sm">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-3">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.8rem] border ${pal.border} bg-[linear-gradient(180deg,#fffdf6, #f8f3e7)] p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-xs font-black text-white`}>{index + 1}</span>
        <div className="min-w-0">
          <p className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] ${pal.accentText}`}><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className={`mt-2 line-clamp-3 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 110)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-4 overflow-hidden rounded-[1.75rem] border ${pal.border} bg-white p-3 ${dc.motion.lift} sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5 sm:p-4`}>
      <div className={`${dc.media.frame} aspect-[5/4] sm:aspect-square`}>
        <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute bottom-2 left-2 rounded-full bg-[var(--slot4-dark-bg)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white sm:bottom-3 sm:left-3 sm:px-3 sm:text-[10px]">Read {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0 p-1 sm:py-2.5 sm:pr-2">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h2 className="mt-2.5 line-clamp-2 text-xl font-black leading-[1.02] tracking-[-0.055em] text-[var(--slot4-page-text)] sm:mt-3 sm:text-2xl">{post.title}</h2>
        <p className={`mt-3 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 140)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-page-text)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function ImageHeroCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-[2rem] border ${pal.border} bg-black text-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5]">
        <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.8))]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur">Image first</span>
        <h3 className="mt-4 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function BookmarkTileCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block rounded-[1.9rem] border ${pal.border} bg-white p-6 ${dc.motion.lift}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]">
          <Bookmark className="h-5 w-5" />
        </span>
        <span className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</span>
      </div>
      <h3 className="mt-8 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 130)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)] opacity-70">
        Open <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

export function FileCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block rounded-[2rem] border ${pal.border} bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-6 ${dc.motion.lift}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-dark-bg)] p-4 text-white">
          <FileText className="h-8 w-8" />
        </div>
        <span className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</span>
      </div>
      <h3 className="mt-8 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className={`mt-4 line-clamp-4 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 160)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
        Open document <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { ShareButton } from '@/editable/components/ShareButton'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref, ArticleListCard, FileCard, BookmarkTileCard, CompactIndexCard, EditorialFeatureCard } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = {
    '--detail-bg': '#f8f3e7',
    '--detail-text': '#18150f',
    '--detail-surface': '#fffdf6',
    '--detail-accent': '#9ab17a',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black/90">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.6rem] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-8 lg:p-10">
        <BackLink task="article" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl lg:text-7xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt={post.title || ''} className="mt-8 max-h-[620px] w-full rounded-[2rem] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.6rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--detail-bg)] ring-1 ring-black/10">
              {logo ? <img src={logo} alt={post.title || ''} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">Business listing</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{post.title}</h1>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1500px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.5rem] border border-black/10 bg-[var(--detail-text)] p-7 text-white shadow-[0_24px_80px_rgba(24,21,15,0.18)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-white/60">Notice board</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--detail-text)]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.7rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-9">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2.5rem] border border-black/10 bg-white p-7 lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--detail-bg)]">
            <Camera className="h-4 w-4" /> Image story
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl">{post.title}</h1>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
              <img src={image} alt={post.title || ''} className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-black/60">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--detail-text)] text-[var(--detail-bg)]"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-5 py-3 text-sm font-black text-[var(--detail-bg)]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-[2.8rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] shadow-[0_24px_80px_rgba(24,21,15,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="relative overflow-hidden bg-[var(--slot4-dark-bg)] p-6 text-white sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-[color:var(--slot4-accent-fill)] blur-3xl" />
              <div className="absolute bottom-8 right-0 h-56 w-56 rounded-full bg-[color:var(--slot4-accent-soft)] blur-3xl" />
            </div>
            <div className="relative z-10 flex h-full flex-col">
              <BackLink task="pdf" />
              <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-white/60">Document library</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl">{post.title}</h1>
              <div className="mt-8 flex flex-wrap gap-2">
                <ShareButton title={post.title} className="border-black/15 bg-black text-white hover:bg-black/90 hover:text-white" />
                {fileUrl ? (
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black/90">
                    <Download className="h-4 w-4" /> Download
                  </Link>
                ) : null}
              </div>
              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">Format</p>
                  <p className="mt-2 text-sm font-bold text-white/90">PDF document</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">Browse</p>
                  <p className="mt-2 text-sm font-bold text-white/90">Clean reading view</p>
                </div>
              </div>
            </div>
          </article>

          <article className="min-w-0 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
              <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--detail-text)] text-[var(--detail-bg)]">
                <FileText className="h-12 w-12" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">Preview</p>
                <p className="mt-3 text-lg font-black leading-tight tracking-[-0.04em] text-[var(--detail-text)]">Open the document or use the share link to send it elsewhere.</p>
              </div>
            </div>
            {images[0] ? (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
                <img src={images[0]} alt={post.title || ''} className="aspect-[16/9] w-full object-cover" />
              </div>
            ) : null}
            {fileUrl ? (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--detail-bg)]">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white p-4">
                  <span className="text-sm font-black">Document preview</span>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black text-white">Open file <Download className="h-4 w-4" /></Link>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
              </div>
            ) : null}
          </article>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div />
        <RelatedPanel task="pdf" post={post} related={related} />
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.7rem] border border-black/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(24,21,15,0.08)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--detail-bg)] ring-1 ring-black/10">
          {images[0] ? <img src={images[0]} alt={post.title || ''} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
        </div>
        <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.08em]">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--detail-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.7rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-black/80`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-black/10 bg-[var(--detail-bg)] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black/50"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-black/10" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-black/45">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/45">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-black/70">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {task !== 'pdf' && post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-black/45">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item, index) => <RelatedCard key={item.id || item.slug || index} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  if (task === 'sbm') return <BookmarkTileCard post={post} href={buildPostUrl(task, post.slug)} />
  if (task === 'pdf') return <FileCard post={post} href={buildPostUrl(task, post.slug)} />
  if (task === 'image') return <Link href={buildPostUrl(task, post.slug)} className="block"><ImageDetailCard post={post} /></Link>
  if (task === 'profile') return <ProfileMiniCard post={post} href={buildPostUrl(task, post.slug)} />
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.5rem] border border-black/10 bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(24,21,15,0.12)]">
      {image ? <img src={image} alt={post.title || ''} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--detail-bg)]"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
      </div>
    </Link>
  )
}

function ImageDetailCard({ post }: { post: SitePost }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
      <img src={getImages(post)[0] || getEditablePostImage(post)} alt={post.title || ''} className="aspect-[4/3] w-full object-cover" />
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-black leading-tight">{post.title}</h3>
      </div>
    </div>
  )
}

function ProfileMiniCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex gap-3 rounded-[1.5rem] border border-black/10 bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(24,21,15,0.12)]">
      <img src={getEditablePostImage(post)} alt={post.title || ''} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-black leading-tight">{post.title}</h3>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.5rem] border border-black/10 bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-black/60">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/55">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}

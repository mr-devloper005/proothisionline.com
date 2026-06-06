import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref, EditorialFeatureCard, RailPostCard, CompactIndexCard, ArticleListCard, BookmarkTileCard, FileCard } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function sectionPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  const timePosts = timeSections.flatMap((section) => section.posts)
  return timePosts.length ? timePosts : posts
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const [lead] = posts
  const leadImage = lead ? getEditablePostImage(lead) : '/placeholder.svg?height=900&width=1400'
  const title = pagesContent.home.hero.title.join(' ')

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[color:var(--slot4-accent-fill)] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[color:var(--slot4-accent-soft)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-0 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#23211d] shadow-[0_35px_100px_rgba(0,0,0,0.32)] lg:grid-cols-[1.18fr_0.82fr]">
          <div className="relative min-h-[360px] overflow-hidden p-5 sm:min-h-[450px] sm:p-6 lg:min-h-[520px] lg:p-8">
            <img src={leadImage} alt={lead?.title || 'Featured document'} className="absolute inset-0 h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,15,11,0.72)_0%,rgba(16,15,11,0.48)_45%,rgba(16,15,11,0.18)_100%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="max-w-2xl">
                <p className={`${dc.type.eyebrow} text-white/70`}>{pagesContent.home.hero.badge}</p>
                <h1 className="mt-4 max-w-xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{title}</h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">{pagesContent.home.hero.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
                    Browse {taskLabel(primaryTask)} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                    Search the archive
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:max-w-md sm:grid-cols-2">
                <div className="rounded-[1.3rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Featured read</p>
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-white/85">{lead?.title || 'Featured documents and reading pieces rise to the top here.'}</p>
                </div>
                <div className="rounded-[1.3rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Library note</p>
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-white/85">Browse the archive through a calmer, more focused reading flow.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0 bg-[#f6f1e0] text-[var(--slot4-page-text)]">
            <div className="flex min-h-[340px] flex-col justify-end p-5 sm:min-h-[520px] sm:p-6 lg:p-8">
              <div className="rounded-[1.8rem] border border-black/8 bg-white p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
                <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Search-first layout</p>
                <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">A clean route to documents, notes, and companion pages.</p>
                <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>The layout keeps the focus on useful reading while preserving room for discovery.</p>
              </div>
              <div className="mt-4 rounded-[1.8rem] border border-black/8 bg-[var(--slot4-page-bg)] p-5 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
                <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Library cue</p>
                <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Warm tones, soft spacing, and durable hierarchy.</p>
                <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>The surface stays light and composed even as the archive grows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const railPosts = sectionPosts(posts, timeSections).slice(0, 10)
  if (!railPosts.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Featured rail</p>
            <h2 className={`${dc.type.sectionTitle} mt-2`}>A few pieces worth opening first.</h2>
          </div>
          <Link href={primaryRoute} className="hidden text-sm font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)] underline-offset-4 hover:underline sm:inline">
            View all {taskLabel(primaryTask)}
          </Link>
        </div>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featurePosts = posts.slice(0, 6)
  if (!featurePosts.length) return null
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Library highlights</p>
            <h2 className={dc.type.sectionTitle}>A broad, premium mix of documents and reading pieces.</h2>
            <p className={`max-w-xl text-base leading-8 ${pal.mutedText}`}>Each card style changes slightly so the page feels collected, not templated. The emphasis stays on utility, readability, and variety.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {featurePosts.slice(0, 2).map((post, index) => (
                <BookmarkTileCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featurePosts.map((post, index) => (
              <div key={post.id || post.slug || index} className={index % 3 === 0 ? 'md:col-span-2' : ''}>
                {index % 3 === 0 ? (
                  <EditorialFeatureCard post={post} href={postHref(primaryTask, post, primaryRoute)} label="Editor’s pick" />
                ) : index % 3 === 1 ? (
                  <ArticleListCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ) : (
                  <FileCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const allPosts = sectionPosts(posts, timeSections)
  const lead = allPosts[0] || posts[0]
  const middle = allPosts.slice(1, 5)
  const small = allPosts.slice(5, 11)

  return (
    <section className="bg-[linear-gradient(180deg,#fff,#f8f3e7)]">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Explore the archive</p>
            <h2 className={dc.type.sectionTitle}>Browse by mood, topic, and reading depth.</h2>
            <p className={`max-w-xl text-base leading-8 ${pal.mutedText}`}>The search area and category chips stay close by so visitors can move from idea to document without extra friction.</p>
            <form action="/search" className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
              <label className="flex items-center gap-3 rounded-full border border-black/10 bg-[var(--slot4-page-bg)] px-4 py-3">
                <Search className="h-4 w-4 opacity-55" />
                <input name="q" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/40" />
              </label>
              <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="grid gap-3">
              <div className="rounded-[1.7rem] border border-black/10 bg-white p-5">
                <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Current focus</p>
                <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Helpful reads, polished PDFs, and practical references.</h3>
              </div>
              <div className="rounded-[1.7rem] border border-black/10 bg-[var(--slot4-accent-soft)] p-5">
                <p className={`${dc.type.eyebrow} text-[var(--slot4-page-text)]`}>Quick route</p>
                <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Open the newest {taskLabel(primaryTask)} without losing context.</h3>
                <Link href={primaryRoute} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-page-text)] underline-offset-4 hover:underline">
                  View the section <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {middle.map((post, index) => (
              <div key={post.id || post.slug || index} className={index % 2 === 0 ? 'md:col-span-2' : ''}>
                <ArticleListCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              </div>
            ))}
            {small.map((post, index) => (
              <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[var(--slot4-dark-bg)] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.26)] sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className={`${dc.type.eyebrow} text-white/65`}>{pagesContent.home.cta.badge}</p>
            <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl">{pagesContent.home.cta.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{pagesContent.home.cta.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
                {pagesContent.home.cta.primaryCta.label}
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5">
              <p className={`${dc.type.eyebrow} text-white/55`}>PDFs</p>
              <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Guides, reports, and documents with room to breathe.</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5">
              <p className={`${dc.type.eyebrow} text-white/55`}>Reading</p>
              <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">A cleaner browsing rhythm for long-form pages.</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5">
              <p className={`${dc.type.eyebrow} text-white/55`}>Search</p>
              <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Built around discovery, not distraction.</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5">
              <p className={`${dc.type.eyebrow} text-white/55`}>Motion</p>
              <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em]">Subtle hover states that stay elegant.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

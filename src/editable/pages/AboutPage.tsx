import { ArrowRight, BookOpenText, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="overflow-hidden rounded-[2.8rem] border border-black/10 bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_80px_rgba(24,21,15,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="relative overflow-hidden p-7 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-[color:var(--slot4-accent-fill)] blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[color:var(--slot4-accent-soft)] blur-3xl" />
              </div>
              <div className="relative z-10 max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{pagesContent.about.badge}</p>
                <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-7xl">About {SITE_CONFIG.name}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{pagesContent.about.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
                    Browse PDFs <BookOpenText className="h-4 w-4" />
                  </Link>
                  <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                    Search the archive <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>

            <aside className="grid gap-4 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-7 text-[var(--slot4-page-text)] sm:p-10 lg:p-12">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border border-black/10 p-6 shadow-[0_18px_46px_rgba(24,21,15,0.08)] ${index === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-white'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black tracking-[-0.05em]">{value.title}</h2>
                    <Sparkles className="h-4 w-4 text-[var(--slot4-accent-fill)]" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-black/60">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {pagesContent.about.paragraphs.map((paragraph, index) => (
            <div key={paragraph} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_46px_rgba(24,21,15,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">0{index + 1}</p>
              <p className="mt-3 text-sm leading-7 text-black/65">{paragraph}</p>
            </div>
          ))}
        </section>
      </main>
    </EditableSiteShell>
  )
}

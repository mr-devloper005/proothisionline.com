import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid min-h-[calc(100vh-12rem)] items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[2.8rem] border border-black/10 bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_24px_80px_rgba(24,21,15,0.18)] sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/60">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/75">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[2.8rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] backdrop-blur sm:p-8">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5">
              <h2 className="text-2xl font-black tracking-[-0.05em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
            </div>
            <p className="mt-5 text-sm text-black/60">New here? <Link href="/signup" className="font-black underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

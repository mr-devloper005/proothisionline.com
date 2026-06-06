import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid min-h-[calc(100vh-12rem)] items-center gap-8 lg:grid-cols-[0.95fr_1fr]">
          <div className="rounded-[2.8rem] border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-7 shadow-[0_24px_80px_rgba(24,21,15,0.08)] sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">{pagesContent.auth.signup.badge}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{pagesContent.auth.signup.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-black/60">{pagesContent.auth.signup.description}</p>
          </div>
          <div className="rounded-[2.8rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(24,21,15,0.08)] backdrop-blur sm:p-8">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)] p-5">
              <h2 className="text-2xl font-black tracking-[-0.05em]">{pagesContent.auth.signup.formTitle}</h2>
              <EditableLocalSignupForm />
            </div>
            <p className="mt-5 text-sm text-black/60">Already have an account? <Link href="/login" className="font-black underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

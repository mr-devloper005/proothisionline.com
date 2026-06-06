'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, BookOpenText, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const year = new Date().getFullYear()
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const footerVars = {
    '--editable-footer-bg': '#201b14',
    '--editable-footer-text': '#fffdf6',
    '--editable-footer-border': 'rgba(255,255,255,0.10)',
  } as CSSProperties

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-footer-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 rounded-[2.5rem] border border-[var(--editable-footer-border)] bg-white/[0.04] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:p-8 lg:grid-cols-[1.15fr_0.85fr_0.85fr] lg:p-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
              </span>
              <span className="text-lg font-black uppercase tracking-[0.28em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                <BookOpenText className="h-4 w-4" /> Browse PDFs
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/5">
                <Mail className="h-4 w-4" /> Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-white/50">Explore</h3>
            <div className="mt-4 grid gap-3">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-white/50">Site</h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-white/80">
              {[
                ['About', '/about'],
                ['Search', '/search'],
                
                ...(session ? [['Upload', '/create']] : [['Login', '/login']]),
              ].map(([label, href]) => (
                <Link key={`${href}-${label}`} href={href} className="transition hover:text-white">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="text-left transition hover:text-white">
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--editable-footer-border)] pt-5 text-xs font-semibold text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>Refined for document lovers and careful readers.</p>
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { Globe, LogIn, Menu, Search, ShieldCheck, Upload, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })), [])
  const headerVars = {
    '--editable-nav-bg': '#201b14',
    '--editable-nav-text': '#fffdf6',
    '--editable-nav-border': 'rgba(255,255,255,0.10)',
    '--editable-nav-soft': 'rgba(255,255,255,0.06)',
  } as CSSProperties

  return (
    <header style={headerVars} className="sticky top-0 z-50 border-b border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--editable-nav-border)] bg-white/[0.04] px-4 py-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition duration-300 group-hover:-translate-y-0.5">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
            </span>
            <span className="text-[0.95rem] font-black uppercase tracking-[0.28em] sm:text-[1rem]">{SITE_CONFIG.name}</span>
          </Link>

          <form action="/search" className="mx-2 hidden min-w-0 flex-1 md:block">
            <label className="flex h-12 w-full items-center gap-3 rounded-full border border-[var(--editable-nav-border)] bg-white px-4 text-[var(--slot4-page-text)] shadow-sm">
              <Search className="h-4 w-4 shrink-0 opacity-55" />
              <input
                name="q"
                type="search"
                placeholder="Search documents, topics, or titles"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/40"
              />
            </label>
          </form>

          <div className="hidden items-center gap-2 lg:flex">
            
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-nav-border)] px-4 py-2 text-sm font-black transition hover:bg-white/5">
              <Upload className="h-4 w-4" /> Upload
            </Link>
            {session ? (
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-nav-border)] px-4 py-2 text-sm font-black transition hover:bg-white/5">
                <ShieldCheck className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-nav-border)] px-4 py-2 text-sm font-black transition hover:bg-white/5">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            )}
            <Link href="/signup" className="inline-flex items-center rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95">
              Sign Up
            </Link>
          </div>

          <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-nav-border)] bg-white/5 transition hover:bg-white/10 lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {open ? (
        <div className="border-t border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4">
            <label className="flex h-12 items-center gap-3 rounded-full border border-[var(--editable-nav-border)] bg-white px-4 text-[var(--slot4-page-text)]">
              <Search className="h-4 w-4 opacity-55" />
              <input name="q" type="search" placeholder="Search documents, topics, or titles" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/40" />
            </label>
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Upload', href: '/create' }] : [{ label: 'Sign in', href: '/login' }])].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-nav-border)] bg-white/5 px-4 py-3 text-sm font-black">
                {item.label}
              </Link>
            ))}
            <Link href="/pdf" onClick={() => setOpen(false)} className="rounded-2xl bg-[var(--slot4-accent-fill)] px-4 py-3 text-sm font-black text-white">
              Download free for 30 days
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

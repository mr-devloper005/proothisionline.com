'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      accent: 'bg-[#18150f] text-white',
      panel: 'border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]',
      soft: 'border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)]',
      muted: 'text-black/60',
    }
  }
  if (kind === 'visual') {
    return {
      accent: 'bg-[#18150f] text-white',
      panel: 'border border-white/10 bg-white/[0.06] text-white shadow-[0_18px_46px_rgba(0,0,0,0.22)]',
      soft: 'border border-white/10 bg-white/[0.04]',
      muted: 'text-white/72',
    }
  }
  return {
    accent: 'bg-[#18150f] text-white',
    panel: 'border border-black/10 bg-white shadow-[0_18px_46px_rgba(24,21,15,0.08)]',
    soft: 'border border-black/10 bg-[linear-gradient(180deg,#fffdf6,#f8f3e7)]',
    muted: 'text-black/60',
  }
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const tone = getTone(productKind)

  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
        ]
      : productKind === 'visual'
        ? [
            { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
            { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
            { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
          ]
        : [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]

  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className={`rounded-[2.5rem] p-7 sm:p-10 ${tone.panel} ${productKind === 'visual' ? 'bg-[var(--slot4-dark-bg)]' : ''}`}>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{pagesContent.contact.eyebrow}</p>
            <h1 className={`mt-4 text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl ${productKind === 'visual' ? 'text-white' : ''}`}>{pagesContent.contact.title}</h1>
            <p className={`mt-5 max-w-2xl text-base leading-8 ${tone.muted}`}>{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5" />
                  <h2 className={`mt-3 text-xl font-black ${productKind === 'visual' ? 'text-white' : ''}`}>{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2.5rem] p-7 sm:p-8 ${tone.panel}`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
              <Mail className="h-4 w-4" /> {pagesContent.contact.formTitle}
            </div>
            <div className="mt-5">
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

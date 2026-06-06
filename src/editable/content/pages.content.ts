import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A premium library for documents and reading',
      description: 'Browse PDFs, articles, lists, and useful pages through a polished editorial experience.',
      openGraphTitle: 'A premium library for documents and reading',
      openGraphDescription: 'Discover documents, reading pages, and practical resources through a refined browsing experience.',
      keywords: ['pdf library', 'document archive', 'reading site', 'editorial browsing'],
    },
    hero: {
      badge: 'Library focus',
      title: ['Elegant documents,', 'thoughtfully arranged.'],
      description: 'Find PDFs, reference pages, and polished reading material in a layout designed for calm browsing and quick decisions.',
      primaryCta: { label: 'Browse PDFs', href: '/pdf' },
      secondaryCta: { label: 'Explore articles', href: '/article' },
      searchPlaceholder: 'Search documents, topics, or titles',
      focusLabel: 'Focus',
      featureCardBadge: 'editorial selection',
      featureCardTitle: 'Featured reads stay visible without crowding the page.',
      featureCardDescription: 'A few highlights lead the experience while the rest of the library stays easy to scan.',
    },
    intro: {
      badge: 'Why it works',
      title: 'Built for reading, browsing, and useful reference.',
      paragraphs: [
        'The layout keeps documents, articles, and supporting pages connected so visitors can move naturally from one reading lane to another.',
        'Each section is designed for quick scanning first, deeper reading second, with enough breathing room to make the page feel premium instead of busy.',
        'Whether someone starts on a PDF, a note, a list, or a profile, the journey stays simple and clear.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Luxury palette built around warm ivory, muted green, and soft parchment tones.',
        'Multiple card styles so every section feels intentional and varied.',
        'Search-led browsing for documents, topics, and titles.',
        'Clean structure that stays responsive on mobile and desktop.',
      ],
      primaryLink: { label: 'Browse PDFs', href: '/pdf' },
      secondaryLink: { label: 'See articles', href: '/article' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Move through a polished reading experience without friction.',
      description: 'Discover documents, articles, and practical pages through a composed layout that feels light, stable, and easy to use.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: { heading: 'Latest {label}', descriptionSuffix: 'Browse the newest additions in this section.' },
  },
  about: {
    badge: 'About this library',
    title: 'A calm, premium place for reading and reference.',
    description: `${slot4BrandConfig.siteName} brings documents, articles, and useful pages into one polished space so browsing feels clear and deliberate.`,
    paragraphs: [
      'The site is shaped around a dark, refined visual system with warm accents, stronger hierarchy, and generous spacing.',
      'Whether someone starts with a PDF, article, listing, or profile page, they can continue exploring without losing context.',
    ],
    values: [
      {
        title: 'Reading first',
        description: 'Clear hierarchy and generous spacing keep long-form content comfortable to scan and read.',
      },
      {
        title: 'Connected surfaces',
        description: 'Documents, posts, listings, and profiles stay linked so discovery feels seamless.',
      },
      {
        title: 'Premium finish',
        description: 'A black-forward palette and soft gold-green accents give the site a distinct, refined mood.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A contact page with a calmer, more editorial feel.',
    description: 'Tell us what you are trying to share, update, or improve, and we will route it through the right lane.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search documents, posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find documents, notes, and useful pages faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your reading space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const

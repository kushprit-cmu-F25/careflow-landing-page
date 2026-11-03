/**
 * Everything that changes per deployment lives in this file.
 */
export const config = {
  /** GA4 measurement ID, e.g. "G-ABC123DEF4". Empty means analytics stays off. */
  gaMeasurementId: 'G-G2ZG05CRWS',

  /** Before/after concept video. YouTube, Google Drive or a direct .mp4 link. */
  videoUrl: 'https://www.youtube.com/watch?v=tmHvyqOXuro',

  /** Public site URL, used for share links and the referral link. */
  siteUrl: 'https://careflow-ban.pages.dev/',

  /**
   * Google Form that receives signups. While `actionUrl` is empty the form runs
   * in preview mode: nothing is sent, and the page says so.
   */
  leadForm: {
    actionUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeIrD6RQK-XeuqdaJX40fMBDwRlq4_JuPA1MZmPslD5qSKR1A/formResponse',
    fields: {
      name: 'entry.1002223038',
      email: 'entry.1670270954',
      source: 'entry.1965999675',
    },
  },

  /**
   * Shows the "concept in development" line. Keep this on for the public link.
   * Add ?present to any URL to hide it without a rebuild.
   */
  showConceptNote: true,
} as const

export type PageVariant = 'home'

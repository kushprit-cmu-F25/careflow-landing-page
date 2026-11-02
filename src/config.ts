/**
 * Everything that changes per deployment lives in this file.
 */
export const config = {
  /** GA4 measurement ID, e.g. "G-ABC123DEF4". Empty means analytics stays off. */
  gaMeasurementId: '',

  /** Before/after concept video. YouTube, Google Drive or a direct .mp4 link. */
  videoUrl: 'https://www.youtube.com/watch?v=tmHvyqOXuro',

  /** Public site URL, used for share links and the referral link. */
  siteUrl: 'https://careflow-ban.pages.dev/',

  /**
   * Google Form that receives signups. While `actionUrl` is empty the form runs
   * in preview mode: nothing is sent, and the page says so.
   */
  leadForm: {
    actionUrl: '',
    fields: {
      name: '',
      email: '',
      source: '',
    },
  },

  /**
   * Shows the "concept in development" line. Keep this on for the public link.
   * Add ?present to any URL to hide it without a rebuild.
   */
  showConceptNote: true,
} as const

export type PageVariant = 'home'

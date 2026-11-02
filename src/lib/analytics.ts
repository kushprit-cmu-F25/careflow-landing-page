import { config } from '@/config'
import type { PageVariant } from '@/config'

type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let currentVariant: PageVariant | undefined

/** Loads the Google tag once. A no-op until a measurement ID is configured. */
export function initAnalytics(variant: PageVariant): void {
  currentVariant = variant
  const id = config.gaMeasurementId
  if (!id || window.gtag) return

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag.js reads the Arguments object
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { page_variant: variant })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.append(script)
}

/**
 * Sends one GA4 event. Never pass names, emails or free text here: GA terms
 * forbid personal data in event parameters.
 */
export function track(name: string, params: Params = {}): void {
  const payload = { page_variant: currentVariant, ...params }
  if (import.meta.env.DEV) console.debug('[analytics]', name, payload)
  window.gtag?.('event', name, payload)
}

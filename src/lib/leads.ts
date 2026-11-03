import { config } from '@/config'
import type { PageVariant } from '@/config'

export type Lead = {
  name: string
  email: string
  variant: PageVariant
}

export type SubmitResult = 'sent' | 'preview'

export const isPreviewMode = (): boolean => config.leadForm.actionUrl.length === 0

/** Where this visitor came from, in the terms the signup sheet records. */
export function leadSource(variant: PageVariant, search = window.location.search): string {
  const params = new URLSearchParams(search)
  const utm = params.get('utm_source')
  return [variant, utm].filter(Boolean).join(' / ')
}

/**
 * Posts one row to the Google Form. Google does not send CORS headers, so the
 * response is opaque: a resolved fetch means the request left the browser.
 */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  const { actionUrl, fields } = config.leadForm
  if (isPreviewMode()) return 'preview'

  const body = new URLSearchParams()
  const rows: [string, string][] = [
    [fields.name, lead.name],
    [fields.email, lead.email],
    [fields.source, leadSource(lead.variant)],
  ]
  for (const [entry, value] of rows) {
    if (entry && value) body.set(entry, value)
  }

  await fetch(actionUrl, { method: 'POST', mode: 'no-cors', body })
  return 'sent'
}

export function validateLead(name: string, email: string): { name?: string; email?: string } {
  const errors: { name?: string; email?: string } = {}
  if (name.trim().length < 2) errors.name = 'Add your name so we know who to write to.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    errors.email = 'That email looks off. Check it and try again.'
  }
  return errors
}

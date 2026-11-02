import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { PageVariant } from '@/config'
import { config } from '@/config'
import { track } from '@/lib/analytics'
import { leadStore, useLeadState } from '@/lib/leadStore'
import { submitLead, validateLead } from '@/lib/leads'
import styles from './LeadCapture.module.css'

/** Each answer is its own GA event, so it shows in reports with no custom dimension setup. */
const ROLES = [
  { label: 'Nurse', event: 'role_nurse' },
  { label: 'Physician', event: 'role_physician' },
  { label: 'PA or NP', event: 'role_pa_np' },
  { label: 'Student', event: 'role_student' },
  { label: 'Something else', event: 'role_other' },
] as const

const PAINS = [
  { label: 'Charting', event: 'pain_charting' },
  { label: 'Finding records', event: 'pain_records' },
  { label: 'Interruptions', event: 'pain_interruptions' },
  { label: 'Handoffs', event: 'pain_handoffs' },
] as const

type LeadCaptureProps = {
  variant: PageVariant
  /** Where on the page this form sits. Recorded with every event. */
  placement: string
  submitLabel?: string
  layout?: 'inline' | 'stacked'
  className?: string
}

export function LeadCapture({
  variant,
  placement,
  submitLabel = 'Get early access',
  layout = 'inline',
  className,
}: LeadCaptureProps) {
  const lead = useLeadState()
  const rootClass = [styles.root, styles[layout], className].filter(Boolean).join(' ')

  return (
    <div className={rootClass}>
      {lead.step === 'form' && (
        <CaptureForm variant={variant} placement={placement} submitLabel={submitLabel} />
      )}
      {lead.step === 'role' && (
        <ChoiceStep
          prompt="Thanks. What’s your role?"
          options={ROLES}
          onPick={(event) => {
            track(event, { placement })
            leadStore.set({ step: 'pain' })
          }}
        />
      )}
      {lead.step === 'pain' && (
        <ChoiceStep
          prompt="What eats the most of your shift?"
          options={PAINS}
          onPick={(event) => {
            track(event, { placement })
            leadStore.set({ step: 'done' })
          }}
        />
      )}
      {lead.step === 'done' && <DoneStep variant={variant} placement={placement} />}
    </div>
  )
}

function CaptureForm({
  variant,
  placement,
  submitLabel,
}: {
  variant: PageVariant
  placement: string
  submitLabel: string
}) {
  const id = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; form?: string }>({})
  const [pending, setPending] = useState(false)
  const started = useRef(false)
  const message = errors.name ?? errors.email ?? errors.form

  const handleChange =
    (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
      if (message) setErrors({})
      if (!started.current) {
        started.current = true
        track('form_start', { placement })
      }
    }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const honeypot = new FormData(event.currentTarget).get('company')
    if (honeypot) return

    const nextErrors = validateLead(name, email)
    if (nextErrors.name || nextErrors.email) {
      setErrors(nextErrors)
      track('form_error', { placement })
      return
    }

    setPending(true)
    try {
      const trimmed = { name: name.trim(), email: email.trim() }
      const result = await submitLead({ ...trimmed, variant })
      track('generate_lead', { placement, preview: result === 'preview' })
      leadStore.set({ ...trimmed, step: 'role', preview: result === 'preview' })
    } catch {
      setErrors({ form: 'That didn’t go through. Check your connection and try again.' })
      track('form_failure', { placement })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-describedby={`${id}-msg`}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className="sr-only">Your name</span>
          <input
            className={styles.input}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={handleChange(setName)}
            aria-invalid={Boolean(errors.name)}
          />
        </label>
        <label className={styles.field}>
          <span className="sr-only">Email address</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="Email"
            value={email}
            onChange={handleChange(setEmail)}
            aria-invalid={Boolean(errors.email)}
          />
        </label>
        <input
          className={styles.honeypot}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? 'Sending' : submitLabel}
        </button>
      </div>
      <p id={`${id}-msg`} className={styles.message} role={message ? 'alert' : undefined}>
        {message ?? '\u00a0'}
      </p>
    </form>
  )
}

function ChoiceStep({
  prompt,
  options,
  onPick,
}: {
  prompt: string
  options: readonly { label: string; event: string }[]
  onPick: (event: string) => void
}) {
  return (
    <div className={styles.step} role="group" aria-label={prompt}>
      <p className={styles.prompt}>{prompt}</p>
      <div className={styles.choices}>
        {options.map(({ label, event }) => (
          <button key={event} className={styles.choice} type="button" onClick={() => onPick(event)}>
            {label}
          </button>
        ))}
      </div>
      <button className={styles.skip} type="button" onClick={() => leadStore.set({ step: 'done' })}>
        Skip
      </button>
    </div>
  )
}

function DoneStep({ variant, placement }: { variant: PageVariant; placement: string }) {
  const { name, preview } = useLeadState()
  const [copied, setCopied] = useState(false)
  const firstName = name.split(' ')[0]

  async function copyLink() {
    const url = new URL(config.siteUrl)
    url.searchParams.set('utm_source', 'referral')
    url.searchParams.set('utm_medium', 'signup')
    url.searchParams.set('utm_campaign', variant)
    await navigator.clipboard.writeText(url.toString())
    setCopied(true)
    track('referral_copy', { placement })
  }

  return (
    <div className={styles.step}>
      <p className={styles.prompt}>
        {preview ? `Thanks, ${firstName}.` : `You’re on the list, ${firstName}.`}
      </p>
      <p className={styles.note}>
        {preview ? 'We’re still building CareFlow.' : 'We’ll email you when you can try it.'}
      </p>
      <button className={styles.choice} type="button" onClick={copyLink}>
        {copied ? 'Link copied' : 'Copy a link for a colleague'}
      </button>
    </div>
  )
}

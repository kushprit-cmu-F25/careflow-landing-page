import { useEffect, useState } from 'react'
import { historySections, historySyncedAt, recordCount } from '@/content/visit'
import { AlertIcon } from '@/components/StatusIcons/StatusIcons'
import type { DemoTarget } from './useChartDemo'
import styles from './PatientHistory.module.css'

const SPOTLIGHT_MS = 1050

type PatientHistoryProps = {
  /** Sarah is reading the record, so each section lights up in turn. */
  walkthrough: boolean
  target: DemoTarget | null
  onAsk: () => void
}

export function PatientHistory({ walkthrough, target, onAsk }: PatientHistoryProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!walkthrough) return
    const timer = window.setInterval(
      () => setStep((value) => Math.min(value + 1, historySections.length)),
      SPOTLIGHT_MS,
    )
    return () => window.clearInterval(timer)
  }, [walkthrough])

  const spotlight = walkthrough ? historySections[step]?.id : undefined

  return (
    <section className={styles.view} aria-label="Patient History">
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>Patient History</h3>
          <p className={styles.sub}>Last synced today at {historySyncedAt}</p>
        </div>
        <button
          className={styles.ask}
          type="button"
          data-cursor-target={target === 'companion-open' ? '' : undefined}
          onClick={onAsk}
        >
          Ask Companion
        </button>
      </header>

      <div className={styles.sections}>
        {historySections.map(({ id, title, records }) => (
          <section
            key={id}
            className={styles.section}
            data-lit={spotlight === id}
            data-dim={Boolean(spotlight) && spotlight !== id}
            aria-label={title}
          >
            <h4 className={styles.sectionTitle}>
              {title}
              <span className={styles.count}>{recordCount(records.length)}</span>
            </h4>
            <ul>
              {records.map(({ name, source, updated, risk }) => (
                <li key={name} className={styles.row}>
                  <span className={styles.name}>
                    {name}
                    {risk && <AlertIcon tone={risk} />}
                  </span>
                  <span className={styles.source}>{source}</span>
                  <span className={styles.updated}>Updated {updated}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

import { historySections, interaction } from '@/content/visit'
import { AlertIcon, CheckIcon } from '@/components/StatusIcons/StatusIcons'
import type { DemoTarget } from './useChartDemo'
import styles from './MedicationReview.module.css'

const recordsFor = (id: string) =>
  historySections.find((section) => section.id === id)?.records ?? []

type MedicationReviewProps = {
  sent: boolean
  target: DemoTarget | null
  onSend: () => void
}

export function MedicationReview({ sent, target, onSend }: MedicationReviewProps) {
  return (
    <section className={styles.view} aria-label="Medication Review">
      <header>
        <h3 className={styles.title}>Medication Review</h3>
        <p className={styles.sub}>Review patient history alongside the proposed medication.</p>
      </header>

      <div className={styles.alert}>
        <h4 className={styles.alertTitle}>
          <AlertIcon tone="interaction" />
          {interaction.title}
        </h4>
        <p className={styles.pair}>
          {interaction.current}
          <span className={styles.plus} aria-label="plus">
            +
          </span>
          {interaction.proposed}
        </p>
        <p className={styles.body}>{interaction.body}</p>
        <div className={styles.alertFoot}>
          <p className={styles.source}>
            Source: {interaction.source}
            <a
              href={interaction.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              View source
            </a>
          </p>
          <button
            className={styles.send}
            type="button"
            disabled={sent}
            data-cursor-target={target === 'send-team' ? '' : undefined}
            onClick={onSend}
          >
            {sent && <CheckIcon />}
            {sent ? interaction.done : interaction.action}
          </button>
        </div>
      </div>

      <div className={styles.panels}>
        <section className={styles.panel} aria-label="Current medications">
          <h4 className={styles.panelTitle}>Current medications</h4>
          <ul>
            {recordsFor('medications').map(({ name, source }) => (
              <li key={name} className={styles.med}>
                <span className={styles.medName}>{name}</span>
                <span className={styles.medSource}>{source}</span>
              </li>
            ))}
          </ul>
          <p className={styles.relevant}>
            Relevant history
            <span>
              {recordsFor('allergies').length} allergy entry · {recordsFor('diagnoses').length} past
              diagnoses
            </span>
          </p>
        </section>

        <section className={styles.panel} aria-label="Proposed medication">
          <h4 className={styles.panelTitle}>Proposed medication</h4>
          <p className={styles.proposed}>{interaction.proposed}</p>
          <p className={styles.status}>{interaction.status}</p>
          <p className={styles.compare}>{interaction.compare}</p>
        </section>
      </div>

      <p className={styles.decision}>{interaction.decision}</p>
    </section>
  )
}

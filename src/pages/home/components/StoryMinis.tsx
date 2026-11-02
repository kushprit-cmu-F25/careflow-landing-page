import {
  chartCards,
  companion,
  historySections,
  interaction,
  patient,
  recordCount,
} from '@/content/visit'
import styles from './StoryMinis.module.css'

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2.5 7.4 5.6 10.5 11.5 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function HistoryMini() {
  return (
    <span className={styles.panel}>
      <span className={styles.head}>
        <span className={styles.avatar} aria-hidden="true">
          {patient.initials}
        </span>
        <span>
          <span className={styles.headTitle}>{patient.name}</span>
          <span className={styles.headMeta}>Identity confirmed</span>
        </span>
      </span>
      {historySections.map(({ id, title, records }) => (
        <span key={id} className={styles.row}>
          <span className={styles.tick}>
            <Check />
          </span>
          <span className={styles.rowLabel}>{title}</span>
          <span className={styles.rowDetail}>{recordCount(records.length)}</span>
        </span>
      ))}
    </span>
  )
}

export function InteractionMini() {
  return (
    <span className={styles.panel}>
      <span className={styles.alertTag}>Possible drug interaction</span>
      <span className={styles.alertTitle}>
        {interaction.current} + {interaction.proposed}
      </span>
      <span className={styles.alertBody}>{interaction.decision}</span>
      <span className={styles.alertAction}>{interaction.action}</span>
    </span>
  )
}

export function CompanionMini() {
  return (
    <span className={styles.panel}>
      <span className={styles.bubble} data-from="you">
        {companion.question}
      </span>
      <span className={styles.bubble} data-from="companion">
        {companion.answer}
        <span className={styles.source}>Source: {companion.source}</span>
      </span>
    </span>
  )
}

export function CardsMini() {
  return (
    <span className={styles.panel}>
      {chartCards.slice(0, 3).map((card) => (
        <span key={card.id} className={styles.chartCard}>
          <span className={styles.chartSection}>{card.section}</span>
          <span className={styles.chartText}>
            <span className={styles.tick}>
              <Check />
            </span>
            {card.text.split('. ')[0]}
          </span>
        </span>
      ))}
    </span>
  )
}

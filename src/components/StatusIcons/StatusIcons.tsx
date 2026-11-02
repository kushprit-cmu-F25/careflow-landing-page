import styles from './StatusIcons.module.css'

export function CheckIcon() {
  return (
    <svg
      className={styles.check}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7.4 5.6 10.5 11.5 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A warning triangle: red for an allergy, amber for a medication risk. */
export function AlertIcon({ tone }: { tone: 'allergy' | 'interaction' }) {
  return (
    <svg
      className={styles.alert}
      data-tone={tone}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      aria-hidden="true"
    >
      <path
        d="M6.1 1.7a1 1 0 0 1 1.8 0l5.2 9.8a1 1 0 0 1-.9 1.5H1.8a1 1 0 0 1-.9-1.5z"
        fill="currentColor"
      />
      <path d="M7 5v3.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10.5" r=".8" fill="#fff" />
    </svg>
  )
}

import { companion } from '@/content/visit'
import type { DemoTarget } from './useChartDemo'
import styles from './CompanionPanel.module.css'

type CompanionPanelProps = {
  open: boolean
  asked: boolean
  target: DemoTarget | null
  onToggle: (open: boolean) => void
  onAsk: () => void
}

/** The cartoon nurse stays in the corner of every screen, as in the wireframes. */
export function CompanionPanel({ open, asked, target, onToggle, onAsk }: CompanionPanelProps) {
  return (
    <>
      {open && (
        <section className={styles.panel} aria-label={companion.name}>
          <header className={styles.header}>
            <div>
              <h3 className={styles.title}>{companion.name}</h3>
              <p className={styles.prompt}>{companion.prompt}</p>
            </div>
            <button
              className={styles.close}
              type="button"
              aria-label={`Close ${companion.name}`}
              data-cursor-target={target === 'companion-close' ? '' : undefined}
              onClick={() => onToggle(false)}
            >
              ×
            </button>
          </header>

          {asked && (
            <div className={styles.thread}>
              <p className={styles.question}>{companion.question}</p>
              <div className={styles.answer}>
                <p>{companion.answer}</p>
                <p className={styles.source}>Source: {companion.source}</p>
                <a
                  className={styles.link}
                  href={companion.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              </div>
            </div>
          )}

          <div className={styles.composer}>
            <p className={styles.input} data-empty={asked}>
              {asked ? companion.placeholder : companion.question}
            </p>
            <button
              className={styles.send}
              type="button"
              disabled={asked}
              data-cursor-target={target === 'companion-send' ? '' : undefined}
              onClick={onAsk}
            >
              Send
            </button>
          </div>
          <p className={styles.foot}>{companion.footnote}</p>
        </section>
      )}

      <button
        className={styles.nurse}
        type="button"
        aria-label={open ? `Close ${companion.name}` : `Open ${companion.name}`}
        aria-expanded={open}
        onClick={() => onToggle(!open)}
      >
        <NurseIcon />
      </button>
    </>
  )
}

function NurseIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.2 11.2V7.6c0-.7.4-1.3 1-1.6a11.2 11.2 0 0 1 9.6 0c.6.3 1 .9 1 1.6v3.6" />
      <path d="M10.2 11.2c1.8-.7 3.7-1 5.8-1s4 .3 5.8 1" />
      <path d="M16 6.2v2.6M14.7 7.5h2.6" />
      <path d="M10.4 11.4v3.3a5.6 5.6 0 0 0 11.2 0v-3.3" />
      <path d="M13.9 16.6c1.2 1 3 1 4.2 0" />
      <path d="M13.4 13.8h.01M18.6 13.8h.01" strokeWidth="1.8" />
      <path d="M7 27c.6-4.2 3.6-6.6 9-6.6s8.4 2.4 9 6.6" />
    </svg>
  )
}

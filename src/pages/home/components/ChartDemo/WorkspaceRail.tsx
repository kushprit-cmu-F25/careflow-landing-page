import type { ReactNode } from 'react'
import { nurse } from '@/content/visit'
import type { DemoTarget, View } from './useChartDemo'
import styles from './WorkspaceRail.module.css'

const items: { view: View; label: string; cue?: DemoTarget; icon: ReactNode }[] = [
  {
    view: 'history',
    label: 'Patient History',
    icon: (
      <path d="M8 7.4a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4zM2.8 14c.5-2.9 2.6-4.4 5.2-4.4s4.7 1.5 5.2 4.4" />
    ),
  },
  {
    view: 'medication',
    label: 'Medication Review',
    cue: 'nav-medication',
    icon: <path d="M9.6 3a3 3 0 0 1 4.2 4.2l-6.6 6.6A3 3 0 0 1 3 9.6zM6.3 6.3l4.2 4.2" />,
  },
  {
    view: 'chart',
    label: 'Live Chart',
    cue: 'nav-chart',
    icon: (
      <path d="M4 2.5h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM5.5 6h5M5.5 8.5h5M5.5 11h3" />
    ),
  },
]

type WorkspaceRailProps = {
  view: View
  target: DemoTarget | null
  onSelect: (view: View) => void
}

export function WorkspaceRail({ view, target, onSelect }: WorkspaceRailProps) {
  return (
    <nav className={styles.rail} data-surface="dark" aria-label="Workspace">
      <p className={styles.group}>Workspace</p>
      <ul className={styles.list}>
        {items.map(({ view: item, label, cue, icon }) => (
          <li key={item}>
            <button
              className={styles.row}
              type="button"
              data-active={view === item}
              data-cursor-target={cue && cue === target ? '' : undefined}
              aria-current={view === item ? 'page' : undefined}
              onClick={() => onSelect(item)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {icon}
              </svg>
              {label}
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">
          {nurse.initials}
        </span>
        {nurse.name}
      </p>
    </nav>
  )
}

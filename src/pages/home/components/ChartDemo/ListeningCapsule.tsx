import { useEffect, useState } from 'react'
import { conversation, VISIT_END_SECONDS } from '@/content/visit'
import { Waveform } from './Waveform'
import styles from './ListeningCapsule.module.css'

const toSeconds = (time: string | undefined): number => {
  const [minutes = '0', seconds = '0'] = (time ?? '').split(':')
  return Number(minutes) * 60 + Number(seconds)
}

const pad = (value: number): string => String(value).padStart(2, '0')
const clock = (seconds: number): string => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`

type ListeningCapsuleProps = {
  /** How many conversation lines are visible. The timer follows their times. */
  lines: number
  speaking: boolean
  active: boolean
  ended: boolean
  paused: boolean
  onTogglePause: () => void
}

export function ListeningCapsule({
  lines,
  speaking,
  active,
  ended,
  paused,
  onTogglePause,
}: ListeningCapsuleProps) {
  const [ticks, setTicks] = useState({ lines, count: 0 })
  const count = ticks.lines === lines ? ticks.count : 0

  useEffect(() => {
    if (!active || ended || paused) return
    const timer = window.setInterval(() => {
      setTicks((value) => ({ lines, count: value.lines === lines ? value.count + 1 : 1 }))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [active, ended, lines, paused])

  const lastLine = toSeconds(conversation[lines - 1]?.time)
  const nextLine = conversation[lines] ? toSeconds(conversation[lines]?.time) : VISIT_END_SECONDS
  const elapsed = ended ? VISIT_END_SECONDS : Math.min(lastLine + count, nextLine - 1)

  return (
    <button
      className={styles.capsule}
      type="button"
      data-ended={ended}
      aria-pressed={paused}
      onClick={onTogglePause}
    >
      <span className="sr-only">{paused ? 'Resume the demo' : 'Pause the demo'}</span>
      <span className={styles.icon} data-paused={paused} aria-hidden="true" />
      <span className={styles.label}>Listening</span>
      <Waveform speaking={speaking && !paused} active={active && !ended && !paused} />
      <span className={styles.time}>{clock(elapsed)}</span>
    </button>
  )
}

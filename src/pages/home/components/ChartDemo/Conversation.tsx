import { useEffect, useRef } from 'react'
import { conversation, nurse, patient } from '@/content/visit'
import type { ConversationLine } from '@/content/visit'
import { ListeningCapsule } from './ListeningCapsule'
import styles from './Conversation.module.css'

const INITIALS: Record<ConversationLine['speaker'], string> = {
  Sarah: nurse.initials,
  Alex: patient.initials,
}

type ConversationProps = {
  lines: number
  /** The line behind the card being reviewed, or null. */
  sourceLine: number | null
  speaking: boolean
  active: boolean
  ended: boolean
  paused: boolean
  onTogglePause: () => void
  visit: number
}

export function Conversation({
  lines,
  sourceLine,
  speaking,
  active,
  ended,
  paused,
  onTogglePause,
  visit,
}: ConversationProps) {
  const scrollRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = scrollRef.current
    if (!list) return
    const source = list.querySelector<HTMLElement>(`[data-line="${sourceLine}"]`)
    list.scrollTop = source ? source.offsetTop - list.offsetTop - 8 : list.scrollHeight
  }, [lines, sourceLine])

  return (
    <section className={styles.panel} aria-label="Conversation">
      <header className={styles.header}>
        <h3 className={styles.heading}>Conversation</h3>
        <p className={styles.people}>
          {nurse.name} · {nurse.role} / {patient.first} · Patient
        </p>
      </header>
      <ol ref={scrollRef} className={styles.turns}>
        {conversation.slice(0, lines).map((line, index) => (
          <Turn key={line.time} line={line} index={index} isSource={sourceLine === index} />
        ))}
      </ol>
      <div className={styles.controls}>
        <ListeningCapsule
          key={visit}
          lines={lines}
          speaking={speaking}
          active={active}
          ended={ended}
          paused={paused}
          onTogglePause={onTogglePause}
        />
      </div>
    </section>
  )
}

type TurnProps = { line: ConversationLine; index: number; isSource: boolean }

function Turn({ line, index, isSource }: TurnProps) {
  const { speaker, role, time } = line
  return (
    <li className={styles.turn} data-line={index} data-source={isSource} data-role={role}>
      <p className={styles.speaker}>
        <span className={styles.avatar} data-role={role} aria-hidden="true">
          {INITIALS[speaker]}
        </span>
        {speaker} · {role}
        <span className={styles.time}>{time}</span>
      </p>
      <p className={styles.line}>
        <Marked line={line} active={isSource} />
      </p>
    </li>
  )
}

function Marked({ line, active }: { line: ConversationLine; active: boolean }) {
  const { text, highlight } = line
  if (!highlight) return <>{text}</>
  const start = text.indexOf(highlight)
  return (
    <>
      {text.slice(0, start)}
      <mark className={styles.mark} data-active={active}>
        {highlight}
      </mark>
      {text.slice(start + highlight.length)}
    </>
  )
}

import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { nurse } from '@/content/visit'
import styles from './DemoCursor.module.css'

type DemoCursorProps = {
  frameRef: RefObject<HTMLElement | null>
  /** Changes whenever the walkthrough's next target changes. */
  step: string
  visible: boolean
}

/**
 * Sarah's cursor during the walkthrough. The promise is that a clinician
 * confirms every entry, so the autoplay shows a clinician doing it.
 */
export function DemoCursor({ frameRef, step, visible }: DemoCursorProps) {
  const cursorRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const cursor = cursorRef.current
    const frame = frameRef.current
    const target = frame?.querySelector('[data-cursor-target]')
    if (!cursor || !frame || !target) return

    const from = frame.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    // Keeps the name tag inside the window for controls near the right edge.
    const x = Math.min(to.left - from.left + to.width * 0.6, from.width - 78)
    const y = to.top - from.top + to.height * 0.6
    cursor.style.transform = `translate(${x}px, ${y}px)`
  }, [frameRef, step])

  return (
    <span ref={cursorRef} className={styles.cursor} data-visible={visible} aria-hidden="true">
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
        <path
          d="M1.5 1.2 14 8.3 8 9.6 5.2 15.6z"
          fill="#fff"
          stroke="#08090a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.name}>{nurse.short}</span>
    </span>
  )
}

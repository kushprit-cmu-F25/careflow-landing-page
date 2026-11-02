import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './Waveform.module.css'

const BAR_COUNT = 20
const IDLE_LEVEL = 0.26

/** Taller in the middle, like a voice meter, rather than a flat row of bars. */
const envelope = (index: number): number =>
  0.35 + 0.65 * Math.sin((Math.PI * (index + 0.5)) / BAR_COUNT)

/**
 * A live voice meter. Bars follow layered sine waves so they never fall into
 * step, and the level eases between speech and room tone.
 */
export function Waveform({ speaking, active }: { speaking: boolean; active: boolean }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!active || reduceMotion) return
    let frame = 0
    let level = IDLE_LEVEL

    const tick = (time: number) => {
      const target = speaking ? 1 : IDLE_LEVEL
      level += (target - level) * 0.08
      bars.current.forEach((bar, index) => {
        if (!bar) return
        const wave =
          Math.sin(time / 170 + index * 1.7) * 0.5 +
          Math.sin(time / 97 + index * 0.6) * 0.3 +
          Math.sin(time / 310 - index * 2.3) * 0.2
        const height = 0.14 + envelope(index) * Math.abs(wave) * level * 0.86
        bar.style.transform = `scaleY(${height.toFixed(3)})`
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduceMotion, speaking])

  return (
    <span className={styles.waveform} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            bars.current[index] = node
          }}
          className={styles.bar}
          style={{ transform: `scaleY(${(envelope(index) * 0.5).toFixed(3)})` }}
        />
      ))}
    </span>
  )
}

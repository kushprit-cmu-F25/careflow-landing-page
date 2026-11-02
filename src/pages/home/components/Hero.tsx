import { motion, useReducedMotion } from 'motion/react'
import { LeadCapture } from '@/components/LeadCapture/LeadCapture'
import hero1400 from '../assets/hero-1400.webp'
import hero800 from '../assets/hero-800.webp'
import { Logo } from './Logo'
import styles from './Hero.module.css'

const sections = [
  { label: 'Video', href: '#video' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Try the demo', href: '#demo' },
  { label: 'Research', href: '#research' },
]

export function Hero({ onWatch }: { onWatch: () => void }) {
  const reduceMotion = useReducedMotion()
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, transform: 'translateY(12px)' },
          animate: { opacity: 1, transform: 'translateY(0px)' },
          transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
        }

  return (
    <section className={styles.hero} id="top">
      <div className={styles.copy}>
        <div className={styles.bar}>
          <Logo />
          <nav aria-label="Page sections">
            <ul className={styles.links}>
              {sections.map(({ label, href }) => (
                <li key={href}>
                  <a className={styles.link} href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.message}>
          <motion.h1 className={styles.title} {...rise(0)}>
            <span className={styles.line}>Emergency room</span>
            <span className={styles.line}>
              charting <span className={styles.who}>for nurses</span>,
            </span>
            <span className={styles.line}>from triage to treatment.</span>
          </motion.h1>
          <motion.p className={styles.lede} {...rise(0.06)}>
            Your patient taps their phone and their meds come up. CareFlow drafts the chart while
            you talk.
          </motion.p>
          <motion.div className={styles.capture} {...rise(0.12)}>
            <LeadCapture variant="home" placement="hero" />
          </motion.div>
        </div>
      </div>

      <button className={styles.photo} type="button" onClick={onWatch}>
        <img
          src={hero1400}
          srcSet={`${hero800} 800w, ${hero1400} 1400w`}
          sizes="(max-width: 960px) 100vw, 50vw"
          width={1400}
          height={785}
          fetchPriority="high"
          alt="A nurse and a patient in an emergency room look at a tablet. He holds his phone against it."
        />
        <span className={styles.play}>
          <span className={styles.triangle} aria-hidden="true" />
          Watch the video
          <span className={styles.length}>1:41</span>
        </span>
      </button>
    </section>
  )
}

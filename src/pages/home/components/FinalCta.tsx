import { LeadCapture } from '@/components/LeadCapture/LeadCapture'
import { Reveal } from './Reveal'
import styles from './FinalCta.module.css'

export function FinalCta() {
  return (
    <section
      className={styles.section}
      id="early-access"
      data-surface="dark"
      aria-labelledby="cta-title"
    >
      <Reveal className={styles.inner}>
        <h2 className={styles.title} id="cta-title">
          Leave when your shift ends.
        </h2>
        <div className={styles.side}>
          <p className={styles.lede}>
            We’re building CareFlow with emergency room nurses. Leave your name and email and we’ll
            tell you when you can try it.
          </p>
          <div className={styles.capture}>
            <LeadCapture variant="home" placement="final" layout="stacked" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

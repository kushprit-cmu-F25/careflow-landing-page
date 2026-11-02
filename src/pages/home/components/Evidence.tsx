import { documentationShare, pajamaTime, scribeBurnout } from '@/content/research'
import type { Finding } from '@/content/research'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'
import styles from './Evidence.module.css'

const findings: Finding[] = [documentationShare, pajamaTime, scribeBurnout]

export function Evidence() {
  return (
    <section className={styles.section} id="research" aria-labelledby="evidence-title">
      <div className={styles.inner}>
        <SectionIntro
          id="evidence-title"
          title="On a 12-hour shift, charting can take almost 5 hours."
        >
          Click any number to read the study. None of them measure CareFlow, because it isn’t built
          yet.
        </SectionIntro>
        <dl className={styles.grid}>
          {findings.map((finding, index) => (
            <Reveal key={finding.figure} className={styles.finding} delay={index * 0.05}>
              <dt className={styles.figure}>{finding.figure}</dt>
              <dd className={styles.claim}>
                {finding.plain ?? finding.claim}
                <a className={styles.source} href={finding.url} target="_blank" rel="noreferrer">
                  {finding.source}, {finding.year}
                </a>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

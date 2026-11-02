import { ChartDemo } from './ChartDemo/ChartDemo'
import { SectionIntro } from './SectionIntro'
import styles from './DemoSection.module.css'

export function DemoSection() {
  return (
    <section className={styles.section} id="demo" aria-labelledby="demo-title">
      <div className={styles.inner}>
        <SectionIntro id="demo-title" title="Try it yourself.">
          This is a clickable mock-up with a made-up patient. Press any button to take over from
          Sarah.
        </SectionIntro>
        <div className={styles.stage}>
          <ChartDemo />
        </div>
      </div>
    </section>
  )
}

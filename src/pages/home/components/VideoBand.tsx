import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'
import styles from './VideoBand.module.css'

export function VideoBand({ onWatch }: { onWatch: () => void }) {
  return (
    <section className={styles.band} id="video" aria-labelledby="video-title">
      <div className={styles.inner}>
        <SectionIntro id="video-title" title="See Sarah’s night shift with and without CareFlow.">
          Same patient, same shift. It takes 1 minute 41 seconds.
        </SectionIntro>
        <Reveal delay={0.06}>
          <button className={styles.poster} type="button" onClick={onWatch}>
            <span className="sr-only">Play the before and after video</span>
            <span className={styles.side} aria-hidden="true">
              <span className={styles.label}>Before</span>
              <span className={styles.time} data-dim="true">
                7:42 AM
              </span>
              <span className={styles.caption}>Her shift ended at 7. She’s still charting.</span>
              <span className={styles.rows}>
                {['Assessment', 'Flowsheet', 'Med rec', 'Reassess', 'Care plan'].map((row) => (
                  <span key={row} className={styles.row}>
                    {row}
                    <span className={styles.rowState} data-tone="open">
                      Not charted
                    </span>
                  </span>
                ))}
              </span>
            </span>
            <span className={styles.side} aria-hidden="true">
              <span className={styles.label}>After</span>
              <span className={styles.time}>7:00 AM</span>
              <span className={styles.caption}>Her shift ended at 7. Her charts are done.</span>
              <span className={styles.rows}>
                {['Assessment', 'Flowsheet', 'Med rec', 'Reassess', 'Care plan'].map((row) => (
                  <span key={row} className={styles.row}>
                    {row}
                    <span className={styles.rowState} data-tone="done">
                      Charted
                    </span>
                  </span>
                ))}
              </span>
            </span>
            <span className={styles.play} aria-hidden="true">
              <span className={styles.triangle} />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  )
}

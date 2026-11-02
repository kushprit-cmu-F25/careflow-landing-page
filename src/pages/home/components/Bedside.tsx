import bedside1400 from '../assets/bedside-1400.webp'
import bedside800 from '../assets/bedside-800.webp'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'
import styles from './Bedside.module.css'

const promises = [
  {
    title: 'Every card starts as a draft.',
    body: 'Nothing goes in the chart until you press Confirm.',
  },
  {
    title: 'You can see where each card came from.',
    body: 'Press Transcript on a card to read the exact words behind it.',
  },
  {
    title: 'Companion shows its source.',
    body: 'Each answer links to the reference it used, so you can read it yourself.',
  },
]

export function Bedside() {
  return (
    <section className={styles.section} aria-labelledby="bedside-title">
      <div className={styles.inner}>
        <SectionIntro id="bedside-title" title="What if it hears something wrong?">
          You fix it. You read every card before it goes in the chart.
        </SectionIntro>
        <Reveal className={styles.photo} delay={0.06}>
          <img
            src={bedside1400}
            srcSet={`${bedside800} 800w, ${bedside1400} 1400w`}
            sizes="(max-width: 1200px) 100vw, 1120px"
            width={1400}
            height={785}
            loading="lazy"
            decoding="async"
            alt="A nurse reads a tablet beside a patient resting in an emergency room bed."
          />
        </Reveal>
        <ul className={styles.list}>
          {promises.map(({ title, body }) => (
            <li key={title} className={styles.item}>
              <h3 className={styles.itemTitle}>{title}</h3>
              <p className={styles.itemBody}>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

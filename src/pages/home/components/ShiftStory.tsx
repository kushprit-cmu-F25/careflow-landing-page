import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'
import { CardsMini, CompanionMini, HistoryMini, InteractionMini } from './StoryMinis'
import styles from './ShiftStory.module.css'

const moments = [
  {
    id: 'history',
    title: 'One tap, and his meds come up',
    body: 'Alex can’t tell Sarah what he takes. He taps the health ID on his phone, and his pharmacy and hospital records come up.',
    Mini: HistoryMini,
  },
  {
    id: 'companion',
    title: 'Ask a question at the bedside',
    body: 'Sarah wants to check one of his drugs. She asks Nurse Companion and gets a short answer with a link to the source.',
    Mini: CompanionMini,
  },
  {
    id: 'interaction',
    title: 'Catch the interaction before the dose',
    body: 'Ketorolac is proposed, but Alex takes warfarin. CareFlow flags it. Sarah sends it to the care team and they make the call.',
    Mini: InteractionMini,
  },
  {
    id: 'chart',
    title: 'Talk to Alex, then check the chart',
    body: 'CareFlow turns the conversation into chart cards. Sarah reads each one, edits what’s wrong and saves before she leaves the room.',
    Mini: CardsMini,
  },
] as const

export function ShiftStory() {
  return (
    <section className={styles.section} id="how-it-works" aria-labelledby="story-title">
      <div className={styles.inner}>
        <SectionIntro
          id="story-title"
          title="“They come in with 20 meds and they can’t tell you any of the medicines if they’re wrong.”"
        >
          An emergency room nurse told us that. Here’s what CareFlow does when that patient comes
          in.
        </SectionIntro>

        <ol className={styles.grid}>
          {moments.map(({ id, title, body, Mini }, index) => (
            <li key={id} className={styles.cell}>
              <Reveal className={styles.moment} delay={index * 0.05}>
                <div className={styles.visual}>
                  <Mini />
                </div>
                <h3 className={styles.momentTitle}>{title}</h3>
                <p className={styles.momentBody}>{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

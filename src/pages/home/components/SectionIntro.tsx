import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import styles from './SectionIntro.module.css'

type SectionIntroProps = {
  id: string
  title: ReactNode
  children: ReactNode
}

/** The page's section opener: a title on the left, what it means on the right. */
export function SectionIntro({ id, title, children }: SectionIntroProps) {
  return (
    <Reveal className={styles.intro}>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </Reveal>
  )
}

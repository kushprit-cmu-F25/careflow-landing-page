import { ConceptNote } from '@/components/ConceptNote/ConceptNote'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer} data-surface="dark">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a className={styles.home} href="#top" aria-label="CareFlow, back to top">
            <Logo />
          </a>
          <ConceptNote className={styles.note} />
        </div>
      </div>
    </footer>
  )
}

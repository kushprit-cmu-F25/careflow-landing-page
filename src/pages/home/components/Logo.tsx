import styles from './Logo.module.css'

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <path d="M11.6 1h9.4a9.4 9.4 0 0 1-9.4 9.4z" />
      <path d="M21 11.6V21a9.4 9.4 0 0 1-9.4-9.4z" />
      <path d="M10.4 21H1a9.4 9.4 0 0 1 9.4-9.4z" />
      <path d="M1 10.4V1a9.4 9.4 0 0 1 9.4 9.4z" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className={styles.logo}>
      <LogoMark />
      CareFlow
    </span>
  )
}

import { patient } from '@/content/visit'
import { CheckIcon } from '@/components/StatusIcons/StatusIcons'
import { LogoMark } from '../Logo'
import styles from './PatientBar.module.css'

export function PatientBar() {
  return (
    <header className={styles.bar}>
      <p className={styles.product}>
        <LogoMark size={16} />
        Patient record
      </p>
      <div className={styles.block}>
        <p className={styles.name}>{patient.name}</p>
        <p className={styles.meta}>DOB {patient.dob}</p>
      </div>
      <div className={styles.block}>
        <p className={styles.id}>Patient ID {patient.id}</p>
        <p className={styles.meta}>{patient.department}</p>
      </div>
      <p className={styles.identity}>
        <CheckIcon />
        Identity confirmed
      </p>
    </header>
  )
}

/**
 * The visit shown on the main page. It follows the team's wireframes (W1 to W4)
 * and the before and after video: same patient, same nurse, same screens, same
 * button labels. Where a wireframe has a placeholder such as "Medication B",
 * this file names a real drug. Change a value here and the demo and the story
 * section both follow. The patient and the records are fictional.
 */
export const patient = {
  name: 'Alex Morgan',
  first: 'Alex',
  initials: 'AM',
  dob: '14 May 1964',
  id: 'PT-00482',
  department: 'Emergency department',
} as const

export const nurse = {
  name: 'Sarah Lee',
  short: 'Sarah',
  role: 'Nurse',
  initials: 'SL',
} as const

export type HistoryRecord = {
  name: string
  source: 'Retail pharmacy' | 'Other hospital'
  updated: string
  risk?: 'allergy' | 'interaction'
}

export type HistorySection = {
  id: string
  title: string
  records: readonly HistoryRecord[]
}

export const historySyncedAt = '21:42'

export const historySections: readonly HistorySection[] = [
  {
    id: 'medications',
    title: 'Medications',
    records: [
      { name: 'Metformin 500 mg', source: 'Retail pharmacy', updated: '28 Oct 2026' },
      {
        name: 'Warfarin 5 mg',
        source: 'Other hospital',
        updated: '27 Oct 2026',
        risk: 'interaction',
      },
      { name: 'Lisinopril 10 mg', source: 'Retail pharmacy', updated: '26 Oct 2026' },
    ],
  },
  {
    id: 'allergies',
    title: 'Allergies',
    records: [
      { name: 'Penicillin', source: 'Other hospital', updated: '27 Oct 2026', risk: 'allergy' },
    ],
  },
  {
    id: 'diagnoses',
    title: 'Past diagnoses',
    records: [
      { name: 'Atrial fibrillation', source: 'Other hospital', updated: '24 Oct 2026' },
      { name: 'Type 2 diabetes', source: 'Other hospital', updated: '20 Oct 2026' },
    ],
  },
]

export const recordCount = (count: number): string => `${count} record${count === 1 ? '' : 's'}`

const DRUG_REFERENCE_URL =
  'https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=human&query=ketorolac+tromethamine'

export const interaction = {
  title: 'Possible drug interaction, review needed',
  current: 'Warfarin',
  proposed: 'Ketorolac',
  body: 'A potential interaction has been flagged for this combination. Review the referenced information with the care team.',
  source: 'Drug interaction reference',
  sourceUrl: DRUG_REFERENCE_URL,
  status: 'Pending physician review',
  compare: 'Compare with the current medication list.',
  decision: 'Care team makes the treatment decision.',
  action: 'Send to care team',
  done: 'Sent to care team',
} as const

export const companion = {
  name: 'Nurse Companion',
  prompt: 'Ask a clinical question',
  placeholder: 'Ask a question…',
  question: 'What should I know about warfarin?',
  answer:
    'Warfarin raises bleeding risk. Ketorolac is contraindicated in patients at high risk of bleeding, so check with the physician first.',
  source: 'Drug reference',
  sourceUrl: DRUG_REFERENCE_URL,
  footnote: 'Answers include sources for review.',
} as const

export type ConversationLine = {
  speaker: 'Sarah' | 'Alex'
  role: 'Nurse' | 'Patient'
  /** Time into the visit, shown beside the speaker. */
  time: string
  text: string
  /** The words that became a chart card. */
  highlight?: string
}

export const conversation: readonly ConversationLine[] = [
  {
    speaker: 'Sarah',
    role: 'Nurse',
    time: '00:02',
    text: 'Alex, can you tell me how you’re feeling?',
  },
  {
    speaker: 'Alex',
    role: 'Patient',
    time: '00:08',
    text: 'I feel confused. I can’t remember which medications I take.',
    highlight: 'I feel confused. I can’t remember which medications I take.',
  },
  {
    speaker: 'Sarah',
    role: 'Nurse',
    time: '00:23',
    text: 'I’ll check the records from your pharmacy and the other hospital.',
    highlight: 'your pharmacy and the other hospital',
  },
  {
    speaker: 'Sarah',
    role: 'Nurse',
    time: '00:36',
    text: 'The records show a possible medication interaction to review.',
    highlight: 'a possible medication interaction',
  },
  { speaker: 'Alex', role: 'Patient', time: '00:49', text: 'Okay. Please check with the team.' },
  {
    speaker: 'Sarah',
    role: 'Nurse',
    time: '01:06',
    text: 'I’ve shared it with the care team. We’re waiting for physician review.',
    highlight: 'shared it with the care team',
  },
]

/** The visit timer stops here, as it does on the wireframe. */
export const VISIT_END_SECONDS = 84

export type ChartCard = {
  id: string
  section: 'Symptoms' | 'Findings' | 'Plan'
  text: string
  /** Index of the conversation line that produced this card. */
  fromLine: number
  /** Shown under a draft. */
  origin: string
  confirmedAt: string
  /** A card CareFlow misheard, so the Edit path has something to catch. */
  misheard?: { text: string; hint: string }
}

export const chartCards: readonly ChartCard[] = [
  {
    id: 'symptoms',
    section: 'Symptoms',
    text: 'Patient appears confused on arrival. Unable to recall current medications.',
    fromLine: 1,
    origin: 'From spoken symptoms · 21:44',
    confirmedAt: '21:44',
  },
  {
    id: 'findings',
    section: 'Findings',
    text: 'Medication history retrieved from two sources. Possible interaction flagged for review.',
    fromLine: 3,
    origin: 'From spoken findings · 21:45',
    confirmedAt: '21:45',
    misheard: {
      text: 'Medication history retrieved from one source. Possible interaction flagged for review.',
      hint: 'Sarah said the pharmacy and the other hospital',
    },
  },
  {
    id: 'plan',
    section: 'Plan',
    text: 'Medication concern shared with the care team. Awaiting physician review.',
    fromLine: 5,
    origin: 'From spoken plan · 21:45',
    confirmedAt: '21:46',
  },
]

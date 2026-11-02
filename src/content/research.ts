/**
 * Every number on the page comes from this file. Each was checked against its
 * source, and each caveat is part of the claim, so keep the wording when you
 * reuse a figure.
 */
export type Finding = {
  figure: string
  claim: string
  /** The same claim and caveats in plainer words, for the main page. */
  plain?: string

  source: string
  year: number
  url: string
}

export const documentationShare: Finding = {
  figure: 'About 40%',
  claim: 'of a nurse’s shift goes to documentation, by one AACN estimate.',
  plain: 'of a nurse’s shift goes to charting, by one AACN estimate.',

  source: 'American Association of Critical-Care Nurses',
  year: 2023,
  url: 'https://www.aacn.org/blog/nursing-documentation-burden-a-critical-problem-to-solve',
}

export const pajamaTime: Finding = {
  figure: '3+ hours',
  claim:
    'a night in the EHR after hours, reported by 33.6% of 3,931 US family medicine residents. Their burnout rate was 65.0%, against 49.5% for the rest.',
  plain:
    'a night in the chart after hours, for 33.6% of 3,931 US family medicine residents. 65% of them reported burnout, against 49.5% of the rest.',

  source: 'Annals of Family Medicine',
  year: 2024,
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11627813/',
}

export const scribeBurnout: Finding = {
  figure: '51.9% to 38.8%',
  claim:
    'drop in self-reported burnout after 30 days with an AI scribe, in an uncontrolled study of ambulatory clinicians. Nurses were not included.',
  plain:
    'of outpatient clinicians reported burnout, before and after 30 days with an AI scribe. The study had no control group and didn’t include nurses.',

  source: 'JAMA Network Open',
  year: 2025,
  url: 'https://doi.org/10.1001/jamanetworkopen.2025.34976',
}

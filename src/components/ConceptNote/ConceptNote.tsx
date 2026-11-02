import { config } from '@/config'

const isPresentMode = (): boolean => new URLSearchParams(window.location.search).has('present')

/**
 * The honest "this is a concept" line. Turn it off with
 * `showConceptNote: false` in config.ts, or add ?present to the URL in class.
 */
export function ConceptNote({ className }: { className?: string }) {
  if (!config.showConceptNote || isPresentMode()) return null
  return (
    <p className={className}>
      CareFlow is a concept in development by a Carnegie Mellon student team. It is not yet
      available for clinical use.
    </p>
  )
}

import { useEffect, useReducer } from 'react'
import { chartCards, conversation } from '@/content/visit'
import type { ChartCard } from '@/content/visit'

export type View = 'history' | 'medication' | 'chart'

/** The one control Sarah's walkthrough will press next. */
export type DemoTarget =
  | 'companion-open'
  | 'companion-send'
  | 'companion-close'
  | 'nav-medication'
  | 'send-team'
  | 'nav-chart'
  | 'confirm'
  | 'edit'
  | 'save'

const LOOP_MS = 5200
/** Arrives at the Live Chart mid-visit, so the window is never empty. */
const FIRST_LINES = 2

/** Long lines take longer to say. */
const lineDelay = (index: number): number =>
  520 + (conversation[index]?.text.split(' ').length ?? 0) * 70

type State = {
  view: View
  /** The Nurse Companion panel is open. */
  companion: boolean
  /** The question has been sent to Companion. */
  asked: boolean
  /** The interaction has gone to the care team. */
  sent: boolean
  /** How many conversation lines are visible. */
  lines: number
  /** Which card is next in line. Equals chartCards.length when the note is done. */
  index: number
  /** The current card has been corrected. */
  fixed: boolean
  /** Text a visitor typed over a card, by id. */
  edits: Record<string, string>
  /** Confirmed cards, by id, with the text that reached the chart. */
  filed: Record<string, string>
  /** The chart has been saved. */
  saved: boolean
  /** The visitor has taken over from Sarah's walkthrough. */
  manual: boolean
  /** Counts replays, so per-visit UI such as the timer can start over. */
  visit: number
}

type Action =
  | { type: 'go'; view: View }
  | { type: 'companion'; open: boolean }
  | { type: 'ask' }
  | { type: 'send' }
  | { type: 'line' }
  | { type: 'fix' }
  | { type: 'confirm' }
  | { type: 'edit'; id: string; text: string }
  | { type: 'save' }
  | { type: 'takeOver' }
  | { type: 'restart' }

const initial: State = {
  view: 'history',
  companion: false,
  asked: false,
  sent: false,
  lines: FIRST_LINES,
  index: 0,
  fixed: false,
  edits: {},
  filed: {},
  saved: false,
  manual: false,
  visit: 0,
}

/** What Sarah presses at each step, and how long she takes to get there. */
const TOUR: Record<DemoTarget, { action: Action; delay: number }> = {
  'companion-open': { action: { type: 'companion', open: true }, delay: 3400 },
  'companion-send': { action: { type: 'ask' }, delay: 1500 },
  'companion-close': { action: { type: 'companion', open: false }, delay: 3600 },
  'nav-medication': { action: { type: 'go', view: 'medication' }, delay: 1000 },
  'send-team': { action: { type: 'send' }, delay: 2600 },
  'nav-chart': { action: { type: 'go', view: 'chart' }, delay: 1900 },
  confirm: { action: { type: 'confirm' }, delay: 2000 },
  edit: { action: { type: 'fix' }, delay: 1800 },
  save: { action: { type: 'save' }, delay: 1700 },
}

export const cardText = (card: ChartCard, fixed: boolean): string =>
  card.misheard && !fixed ? card.misheard.text : card.text

export const needsFix = (card: ChartCard, fixed: boolean): boolean =>
  Boolean(card.misheard) && !fixed

function reducer(state: State, action: Action): State {
  const card = chartCards[state.index]
  switch (action.type) {
    case 'go':
      return { ...state, view: action.view, companion: false }
    case 'companion':
      return { ...state, companion: action.open }
    case 'ask':
      return { ...state, asked: true }
    case 'send':
      return { ...state, sent: true }
    case 'line':
      return { ...state, lines: state.lines + 1 }
    case 'fix':
      return { ...state, fixed: true }
    case 'confirm':
      // A flagged value cannot reach the chart until someone corrects it.
      if (!card || needsFix(card, state.fixed)) return state
      return {
        ...state,
        index: state.index + 1,
        fixed: false,
        filed: { ...state.filed, [card.id]: state.edits[card.id] ?? card.text },
      }
    case 'edit':
      return {
        ...state,
        edits: { ...state.edits, [action.id]: action.text },
        filed:
          action.id in state.filed ? { ...state.filed, [action.id]: action.text } : state.filed,
      }
    case 'save':
      return card ? state : { ...state, saved: true }
    case 'takeOver':
      return { ...state, manual: true }
    case 'restart':
      return {
        ...initial,
        view: state.manual ? 'chart' : 'history',
        manual: state.manual,
        visit: state.visit + 1,
      }
  }
}

function nextTarget(state: State, card: ChartCard | undefined, ready: boolean): DemoTarget | null {
  switch (state.view) {
    case 'history':
      if (state.companion) return state.asked ? 'companion-close' : 'companion-send'
      return state.asked ? 'nav-medication' : 'companion-open'
    case 'medication':
      return state.sent ? 'nav-chart' : 'send-team'
    case 'chart':
      if (!card) return state.saved ? null : 'save'
      if (!ready) return null
      return needsFix(card, state.fixed) ? 'edit' : 'confirm'
  }
}

/**
 * Plays Sarah's walk through the workspaces, in the order the video shows them,
 * until the visitor presses something. With `autoplay` off, conversation lines
 * still arrive on the Live Chart but every step waits for the visitor.
 */
export function useChartDemo(active: boolean, autoplay = true) {
  const [state, dispatch] = useReducer(reducer, initial)
  const card = chartCards[state.index]
  const finished = !card
  const ready = card ? state.lines > card.fromLine : false
  const hands = autoplay && !state.manual
  const target = nextTarget(state, card, ready)
  const onChart = state.view === 'chart'

  useEffect(() => {
    if (!active) return
    let next: Action | undefined
    let delay = 0

    if (onChart && card && !ready) {
      next = { type: 'line' }
      delay = lineDelay(state.lines)
    } else if (!hands) {
      return
    } else if (state.saved) {
      next = { type: 'restart' }
      delay = LOOP_MS
    } else if (target) {
      next = TOUR[target].action
      delay = TOUR[target].delay
    } else {
      return
    }

    const action = next
    const timer = window.setTimeout(() => dispatch(action), delay)
    return () => window.clearTimeout(timer)
  }, [active, card, hands, onChart, ready, state.lines, state.saved, target])

  return {
    ...state,
    card,
    ready,
    finished,
    hands,
    target: hands ? target : null,
    speaking: onChart && !ready && !finished,
    dispatch,
  }
}

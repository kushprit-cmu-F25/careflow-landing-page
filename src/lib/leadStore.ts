import { useSyncExternalStore } from 'react'

export type LeadStep = 'form' | 'role' | 'pain' | 'done'

export type LeadState = {
  step: LeadStep
  name: string
  email: string
  preview: boolean
}

const initial: LeadState = { step: 'form', name: '', email: '', preview: false }

let state = initial
const listeners = new Set<() => void>()

/**
 * A page can render the capture form twice (hero and footer). Both read this
 * store, so signing up in one advances the other.
 */
export const leadStore = {
  get: () => state,
  set(patch: Partial<LeadState>) {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  },
  reset() {
    state = initial
    listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export const useLeadState = (): LeadState =>
  useSyncExternalStore(leadStore.subscribe, leadStore.get, leadStore.get)

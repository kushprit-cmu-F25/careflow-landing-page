import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { track } from '@/lib/analytics'
import { CompanionPanel } from './CompanionPanel'
import { Conversation } from './Conversation'
import { DemoCursor } from './DemoCursor'
import { LiveChart } from './LiveChart'
import { MedicationReview } from './MedicationReview'
import { PatientBar } from './PatientBar'
import { PatientHistory } from './PatientHistory'
import { useChartDemo } from './useChartDemo'
import { WorkspaceRail } from './WorkspaceRail'
import styles from './ChartDemo.module.css'

export function ChartDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [peek, setPeek] = useState<number | null>(null)
  const demo = useChartDemo(inView && !paused, !reduceMotion)
  const { view, companion, asked, sent, lines, card, ready, finished } = demo
  const { filed, edits, fixed, saved, manual, hands, target, speaking, visit, dispatch } = demo
  const actionRef = useRef<HTMLButtonElement>(null)
  const touched = useRef(false)

  const interact = (action: Parameters<typeof dispatch>[0]) => {
    if (!touched.current) {
      touched.current = true
      track('demo_interact', { action: action.type })
    }
    setPeek(null)
    dispatch({ type: 'takeOver' })
    dispatch(action)
  }

  // Keep keyboard and repeat-click users on the next action.
  useEffect(() => {
    if (manual && (ready || finished)) actionRef.current?.focus({ preventScroll: true })
  }, [manual, ready, finished, card, fixed])

  useEffect(() => {
    if (saved && manual) track('demo_complete')
  }, [saved, manual])

  const sourceLine = peek ?? (ready && card ? card.fromLine : null)

  return (
    <div
      ref={rootRef}
      className={styles.frame}
      role="group"
      aria-label="Interactive demo of CareFlow with a fictional patient"
    >
      <PatientBar />
      <WorkspaceRail
        view={view}
        target={target}
        onSelect={(next) => interact({ type: 'go', view: next })}
      />
      <div key={view} className={styles.stage} data-view={view}>
        {view === 'history' && (
          <PatientHistory
            walkthrough={hands && inView && !paused && !companion && !asked}
            target={target}
            onAsk={() => interact({ type: 'companion', open: true })}
          />
        )}
        {view === 'medication' && (
          <MedicationReview sent={sent} target={target} onSend={() => interact({ type: 'send' })} />
        )}
        {view === 'chart' && (
          <>
            <LiveChart
              filed={filed}
              edits={edits}
              currentId={card?.id}
              ready={ready}
              fixed={fixed}
              finished={finished}
              saved={saved}
              hands={hands}
              target={target}
              actionRef={actionRef}
              onConfirm={() => interact({ type: 'confirm' })}
              onFix={() => interact({ type: 'fix' })}
              onEdit={(id, text) => interact({ type: 'edit', id, text })}
              onStartEdit={() => interact({ type: 'takeOver' })}
              onSave={() => interact({ type: 'save' })}
              onReplay={() => interact({ type: 'restart' })}
              onShowSource={setPeek}
            />
            <Conversation
              lines={lines}
              sourceLine={sourceLine}
              speaking={speaking}
              active={inView}
              ended={finished}
              paused={paused}
              onTogglePause={() => setPaused((value) => !value)}
              visit={visit}
            />
          </>
        )}
      </div>
      <CompanionPanel
        open={companion}
        asked={asked}
        target={target}
        onToggle={(open) => interact({ type: 'companion', open })}
        onAsk={() => interact({ type: 'ask' })}
      />
      <DemoCursor
        frameRef={rootRef}
        step={`${view}-${target}-${card?.id}`}
        visible={hands && target !== null && inView && !paused}
      />
    </div>
  )
}

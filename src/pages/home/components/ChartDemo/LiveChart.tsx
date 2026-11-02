import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { chartCards, conversation, nurse } from '@/content/visit'
import type { ChartCard } from '@/content/visit'
import { CheckIcon } from '@/components/StatusIcons/StatusIcons'
import { cardText, needsFix } from './useChartDemo'
import type { DemoTarget } from './useChartDemo'
import styles from './LiveChart.module.css'

type LiveChartProps = {
  filed: Record<string, string>
  edits: Record<string, string>
  currentId: string | undefined
  ready: boolean
  fixed: boolean
  finished: boolean
  saved: boolean
  /** Sarah's walkthrough is playing. */
  hands: boolean
  target: DemoTarget | null
  actionRef: RefObject<HTMLButtonElement | null>
  onConfirm: () => void
  onFix: () => void
  onEdit: (id: string, text: string) => void
  onStartEdit: () => void
  onSave: () => void
  onReplay: () => void
  onShowSource: (line: number) => void
}

export function LiveChart({
  filed,
  edits,
  currentId,
  ready,
  fixed,
  finished,
  saved,
  hands,
  target,
  actionRef,
  onConfirm,
  onFix,
  onEdit,
  onStartEdit,
  onSave,
  onReplay,
  onShowSource,
}: LiveChartProps) {
  const confirmed = Object.keys(filed).length
  const drafts = chartCards.length - confirmed

  return (
    <section className={styles.chart} aria-label="Live Chart Canvas">
      <header className={styles.header}>
        <h3 className={styles.title}>Live Chart Canvas</h3>
        <p className={styles.sub}>Review spoken findings, one card at a time.</p>
        <p className={styles.progress}>
          {confirmed} confirmed
          {drafts > 0 && ` · ${drafts} draft${drafts === 1 ? '' : 's'}`}
        </p>
      </header>

      <ol className={styles.cards}>
        {chartCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            filedText={filed[card.id]}
            editedText={edits[card.id]}
            isNext={currentId === card.id}
            suggesting={currentId === card.id && ready}
            fixed={fixed}
            target={target}
            actionRef={actionRef}
            onConfirm={onConfirm}
            onFix={onFix}
            onEdit={onEdit}
            onStartEdit={onStartEdit}
            onShowSource={onShowSource}
          />
        ))}
      </ol>

      <footer className={styles.footer}>
        <p className={styles.hint}>
          {statusLine({ finished, saved, hands })}
          {saved && (
            <button className={styles.replay} type="button" onClick={onReplay}>
              Replay
            </button>
          )}
        </p>
        <button
          ref={finished && !saved ? actionRef : undefined}
          className={styles.primary}
          type="button"
          disabled={!finished || saved}
          data-cursor-target={target === 'save' ? '' : undefined}
          onClick={onSave}
        >
          {saved ? 'Saved' : 'Review and Save'}
        </button>
      </footer>
    </section>
  )
}

function statusLine({
  finished,
  saved,
  hands,
}: {
  finished: boolean
  saved: boolean
  hands: boolean
}): string {
  if (saved) return 'Saved to the patient chart.'
  if (finished) return 'Every card reviewed. Ready to save.'
  if (hands) return 'Sarah is reviewing. Press any button to take over.'
  return 'Review draft cards before saving to the patient chart.'
}

type CardProps = {
  card: ChartCard
  filedText: string | undefined
  editedText: string | undefined
  /** This is the card the visit is on right now. */
  isNext: boolean
  suggesting: boolean
  fixed: boolean
  target: DemoTarget | null
  actionRef: RefObject<HTMLButtonElement | null>
  onConfirm: () => void
  onFix: () => void
  onEdit: (id: string, text: string) => void
  onStartEdit: () => void
  onShowSource: (line: number) => void
}

function Card({
  card,
  filedText,
  editedText,
  isNext,
  suggesting,
  fixed,
  target,
  actionRef,
  onConfirm,
  onFix,
  onEdit,
  onStartEdit,
  onShowSource,
}: CardProps) {
  const [editing, setEditing] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const confirmed = filedText !== undefined
  const reached = confirmed || suggesting
  const flagged = suggesting && needsFix(card, fixed)
  const text = filedText ?? editedText ?? cardText(card, fixed)

  const pressEdit = () => {
    if (flagged) {
      onFix()
      return
    }
    if (editing) {
      onEdit(card.id, editorRef.current?.value ?? text)
      setEditing(false)
      return
    }
    onStartEdit()
    setEditing(true)
  }

  return (
    <li className={styles.card} data-reached={reached} data-check={flagged}>
      <div className={styles.cardBody}>
        <h4 className={styles.cardTitle}>
          {card.section}
          {confirmed && (
            <span className={styles.confirmed}>
              <CheckIcon />
              Confirmed
            </span>
          )}
          {reached && !confirmed && <span className={styles.draft}>Draft</span>}
        </h4>

        {!reached && <p className={styles.pending}>{isNext ? 'Listening' : '–'}</p>}
        {reached && !editing && <p className={styles.cardText}>{text}</p>}
        {reached && editing && (
          <textarea
            ref={editorRef}
            className={styles.editor}
            defaultValue={text}
            rows={2}
            aria-label={`Edit ${card.section}`}
          />
        )}
        {flagged && <p className={styles.check}>{card.misheard?.hint}</p>}

        {reached && (
          <p className={styles.meta}>
            <button
              className={styles.source}
              type="button"
              onClick={() => onShowSource(card.fromLine)}
            >
              Transcript {conversation[card.fromLine]?.time}
            </button>
            <span>
              {confirmed ? `Confirmed by ${nurse.name} · ${card.confirmedAt}` : card.origin}
            </span>
          </p>
        )}
      </div>

      {reached && (
        <div className={styles.actions}>
          {!confirmed && (
            <button
              ref={flagged ? undefined : actionRef}
              className={styles.primary}
              type="button"
              disabled={flagged || editing}
              data-cursor-target={suggesting && target === 'confirm' ? '' : undefined}
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
          <button
            ref={flagged ? actionRef : undefined}
            className={styles.quiet}
            type="button"
            data-cursor-target={flagged && target === 'edit' ? '' : undefined}
            onClick={pressEdit}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
      )}
    </li>
  )
}

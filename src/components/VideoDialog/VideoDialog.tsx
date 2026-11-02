import { useEffect, useRef } from 'react'
import { config } from '@/config'
import { track } from '@/lib/analytics'
import { resolveVideo } from '@/lib/video'
import styles from './VideoDialog.module.css'

type VideoDialogProps = {
  open: boolean
  onClose: () => void
  placement: string
}

/** The before/after concept video, in a native <dialog> for focus handling. */
export function VideoDialog({ open, onClose, placement }: VideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const video = resolveVideo(config.videoUrl)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      track('video_open', { placement })
    }
    if (!open && dialog.open) dialog.close()
  }, [open, placement])

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- backdrop click closes; Esc is handled natively
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="CareFlow before and after video"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <div className={styles.frame}>
        {open && video?.kind === 'iframe' && (
          <iframe
            className={styles.media}
            src={video.src}
            title="CareFlow before and after video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
        {open && video?.kind === 'file' && (
          // eslint-disable-next-line jsx-a11y/media-has-caption -- team-supplied file; captions ship inside the video
          <video className={styles.media} src={video.src} controls autoPlay />
        )}
        {!video && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>The before and after video is in the edit.</p>
            <p className={styles.emptyBody}>Join the list and we’ll send it over.</p>
          </div>
        )}
      </div>
      <button className={styles.close} type="button" onClick={onClose}>
        Close
      </button>
    </dialog>
  )
}

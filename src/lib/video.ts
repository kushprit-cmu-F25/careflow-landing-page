export type VideoSource = { kind: 'iframe' | 'file'; src: string }

/** Turns a share link from YouTube or Drive into something a page can embed. */
export function resolveVideo(url: string): VideoSource | null {
  if (!url) return null

  const youtube = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  )
  if (youtube) {
    return {
      kind: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`,
    }
  }

  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return { kind: 'iframe', src: `https://drive.google.com/file/d/${drive[1]}/preview` }

  if (/\.(mp4|webm)(\?|$)/i.test(url)) return { kind: 'file', src: url }
  return { kind: 'iframe', src: url }
}

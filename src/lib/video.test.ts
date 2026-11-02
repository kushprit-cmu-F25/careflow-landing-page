import { resolveVideo } from './video'

describe('resolveVideo', () => {
  it('returns null when no link is set', () => {
    expect(resolveVideo('')).toBeNull()
  })

  it.each([
    ['https://youtu.be/dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ'],
  ])('embeds the YouTube link %s', (url) => {
    expect(resolveVideo(url)?.src).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
  })

  it('embeds a Drive share link', () => {
    expect(resolveVideo('https://drive.google.com/file/d/abc_123/view?usp=sharing')).toEqual({
      kind: 'iframe',
      src: 'https://drive.google.com/file/d/abc_123/preview',
    })
  })

  it('plays a direct file', () => {
    expect(resolveVideo('https://example.com/careflow.mp4')?.kind).toBe('file')
  })
})

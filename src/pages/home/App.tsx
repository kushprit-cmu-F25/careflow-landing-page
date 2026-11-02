import { useState } from 'react'
import { VideoDialog } from '@/components/VideoDialog/VideoDialog'
import { Bedside } from './components/Bedside'
import { DemoSection } from './components/DemoSection'

import { Evidence } from './components/Evidence'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { ShiftStory } from './components/ShiftStory'
import { VideoBand } from './components/VideoBand'

export function App() {
  const [videoPlacement, setVideoPlacement] = useState<string | null>(null)

  return (
    <>
      <main>
        <Hero onWatch={() => setVideoPlacement('hero')} />
        <VideoBand onWatch={() => setVideoPlacement('band')} />
        <ShiftStory />
        <DemoSection />

        <Bedside />
        <Evidence />
        <FinalCta />
      </main>
      <Footer />
      <VideoDialog
        open={videoPlacement !== null}
        onClose={() => setVideoPlacement(null)}
        placement={videoPlacement ?? 'hero'}
      />
    </>
  )
}

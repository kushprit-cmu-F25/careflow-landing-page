import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { leadStore } from '@/lib/leadStore'
import { LeadCapture } from './LeadCapture'
import type * as ConfigModule from '@/config'

// Keep these tests offline: they cover the preview flow, so no signup is sent.
vi.mock('@/config', async (importOriginal) => {
  const actual = await importOriginal<typeof ConfigModule>()
  return {
    ...actual,
    config: { ...actual.config, leadForm: { ...actual.config.leadForm, actionUrl: '' } },
  }
})

describe('LeadCapture', () => {
  beforeEach(() => act(() => leadStore.reset()))

  const fill = async (name: string, email: string) => {
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('Your name'), name)
    await user.type(screen.getByPlaceholderText('Email'), email)
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    return user
  }

  it('blocks a bad email and says why', async () => {
    render(<LeadCapture variant="home" placement="hero" />)
    await fill('Sarah Lee', 'sarah@')
    expect(screen.getByRole('alert')).toHaveTextContent('email')
    expect(leadStore.get().step).toBe('form')
  })

  it('walks through role and pain to the done state', async () => {
    render(<LeadCapture variant="home" placement="hero" />)
    const user = await fill('Sarah Lee', 'sarah@example.com')
    await user.click(await screen.findByRole('button', { name: 'Nurse' }))
    await user.click(await screen.findByRole('button', { name: 'Charting' }))
    expect(await screen.findByText(/Thanks, Sarah/)).toBeInTheDocument()
  })

  it('shows no notice under the form before anyone types', () => {
    render(<LeadCapture variant="home" placement="hero" />)
    expect(screen.queryByText(/Signups are not saved yet/)).not.toBeInTheDocument()
  })

  it('never claims a saved signup in preview mode', async () => {
    render(<LeadCapture variant="home" placement="hero" />)
    const user = await fill('Sarah Lee', 'sarah@example.com')
    await user.click(await screen.findByRole('button', { name: 'Skip' }))
    expect(await screen.findByText('Thanks, Sarah.')).toBeInTheDocument()
    expect(screen.queryByText(/on the list/)).not.toBeInTheDocument()
    expect(screen.queryByText(/email you/)).not.toBeInTheDocument()
  })

  it('advances a second copy of the form on the same page', async () => {
    render(
      <>
        <LeadCapture variant="home" placement="hero" />
        <LeadCapture variant="home" placement="final" />
      </>,
    )
    const user = userEvent.setup()
    await user.type(screen.getAllByPlaceholderText('Your name')[0]!, 'Sarah Lee')
    await user.type(screen.getAllByPlaceholderText('Email')[0]!, 'sarah@example.com')
    await user.click(screen.getAllByRole('button', { name: 'Get early access' })[0]!)
    expect(await screen.findAllByRole('button', { name: 'Nurse' })).toHaveLength(2)
  })
})

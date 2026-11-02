import { act, renderHook } from '@testing-library/react'
import { chartCards } from '@/content/visit'
import { cardText, useChartDemo } from './useChartDemo'

describe('useChartDemo', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const findings = chartCards.find((card) => card.id === 'findings')!

  const run = (ms: number) => act(() => vi.advanceTimersByTime(ms))
  const until = (done: () => boolean) => {
    for (let i = 0; i < 160 && !done(); i += 1) run(500)
  }
  const startOnChart = () => {
    const hook = renderHook(() => useChartDemo(true))
    act(() => hook.result.current.dispatch({ type: 'takeOver' }))
    act(() => hook.result.current.dispatch({ type: 'go', view: 'chart' }))
    return hook
  }

  it('walks the workspaces in the order the video shows them', () => {
    const { result } = renderHook(() => useChartDemo(true))
    const seen = [result.current.view]
    until(() => {
      const { view } = result.current
      if (seen[seen.length - 1] !== view) seen.push(view)
      return result.current.saved
    })
    expect(seen).toEqual(['history', 'medication', 'chart'])
    expect(result.current.asked).toBe(true)
    expect(result.current.sent).toBe(true)
  })

  it('files every card and saves the chart', () => {
    const { result } = renderHook(() => useChartDemo(true))
    until(() => result.current.saved)
    expect(Object.keys(result.current.filed)).toHaveLength(chartCards.length)
  })

  it('corrects the misheard card before filing it', () => {
    const { result } = renderHook(() => useChartDemo(true))
    until(() => result.current.finished)
    expect(result.current.filed.findings).toBe(findings.text)
  })

  it('waits for the visitor once they take over', () => {
    const { result } = startOnChart()
    for (let i = 0; i < 10; i += 1) run(2000)
    expect(result.current.ready).toBe(true)
    expect(result.current.filed).toEqual({})
  })

  it('never auto-confirms when autoplay is off', () => {
    const { result } = renderHook(() => useChartDemo(true, false))
    act(() => result.current.dispatch({ type: 'go', view: 'chart' }))
    for (let i = 0; i < 10; i += 1) run(2000)
    expect(result.current.ready).toBe(true)
    expect(result.current.filed).toEqual({})
  })

  it('refuses to file a flagged value until it is fixed', () => {
    const { result } = startOnChart()
    until(() => result.current.ready)
    act(() => result.current.dispatch({ type: 'confirm' }))
    until(() => result.current.ready)
    expect(result.current.card?.id).toBe('findings')
    act(() => result.current.dispatch({ type: 'confirm' }))
    expect(result.current.filed.findings).toBeUndefined()
    act(() => result.current.dispatch({ type: 'fix' }))
    act(() => result.current.dispatch({ type: 'confirm' }))
    expect(result.current.filed.findings).toBe(findings.text)
  })

  it('keeps a typed edit, before and after confirming', () => {
    const { result } = startOnChart()
    until(() => result.current.ready)
    act(() => result.current.dispatch({ type: 'edit', id: 'symptoms', text: 'Edited.' }))
    act(() => result.current.dispatch({ type: 'confirm' }))
    expect(result.current.filed.symptoms).toBe('Edited.')
    act(() => result.current.dispatch({ type: 'edit', id: 'symptoms', text: 'Edited twice.' }))
    expect(result.current.filed.symptoms).toBe('Edited twice.')
  })

  it('keeps the chart after saving', () => {
    const { result } = renderHook(() => useChartDemo(true))
    until(() => result.current.saved)
    expect(Object.keys(result.current.filed)).toHaveLength(chartCards.length)
  })

  it('shows the misheard text until it is fixed', () => {
    expect(cardText(findings, false)).toBe(findings.misheard?.text)
    expect(cardText(findings, true)).toBe(findings.text)
  })

  it('stops when offscreen', () => {
    const { result } = renderHook(() => useChartDemo(false))
    run(10000)
    expect(result.current.view).toBe('history')
    expect(result.current.companion).toBe(false)
  })
})

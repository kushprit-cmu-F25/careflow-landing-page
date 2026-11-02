import { leadSource, validateLead } from './leads'

describe('validateLead', () => {
  it('accepts a real name and email', () => {
    expect(validateLead('Sarah Lee', 'sarah@example.com')).toEqual({})
  })

  it('rejects a blank name', () => {
    expect(validateLead(' ', 'sarah@example.com').name).toBeTruthy()
  })

  it.each(['sarah', 'sarah@', 'sarah@example', 'sarah example@x.com'])('rejects %s', (email) => {
    expect(validateLead('Sarah', email).email).toBeTruthy()
  })
})

describe('leadSource', () => {
  it('records the variant alone for direct traffic', () => {
    expect(leadSource('home', '')).toBe('home')
  })

  it('adds the UTM source when one is present', () => {
    expect(leadSource('home', '?utm_source=linkedin&utm_medium=social')).toBe('home / linkedin')
  })
})

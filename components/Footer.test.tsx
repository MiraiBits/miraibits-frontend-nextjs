import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the footer', () => {
    render(<Footer />)

    const heading = screen.getByRole('heading', { name: /Miraibits/i, level: 3 })
    expect(heading).toBeInTheDocument()

    const copyright = screen.getByText(/© \d{4} Miraibits. All rights reserved./i)
    expect(copyright).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Logo from '../Logo'

describe('Logo Component', () => {
  it('renders without crashing', () => {
    render(<Logo />)
    const logo = screen.getByRole('img')
    expect(logo).toBeInTheDocument()
  })

  it('has correct alt text', () => {
    render(<Logo />)
    const logo = screen.getByRole('img')
    expect(logo).toHaveAttribute('alt', 'DevCommons Logo')
  })
})

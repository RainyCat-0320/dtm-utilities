import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement scrollIntoView.
Element.prototype.scrollIntoView ??= () => {}

afterEach(() => {
  cleanup()
})

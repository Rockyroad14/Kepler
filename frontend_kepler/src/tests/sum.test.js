// sum.test.js
import { expect, test } from 'vitest'
import { sum } from '../components/sum'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

  // this is to test if vitest is still working, ignore this
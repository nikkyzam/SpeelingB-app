import { afterEach, it, expect, vi } from 'vitest'
import { BookService } from '@/services/books/bookService'
afterEach(() => vi.unstubAllGlobals())

it('opens a bundled story without any outside catalogue request', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
  const local = BookService.getAllAvailableBooks()[0]
  const book = await BookService.fetchFullBookContent(local.id)
  expect(book?.pages.length).toBeGreaterThan(0)
  expect(book?.pages.every(page => page.content.trim().length > 0)).toBe(true)
  expect(fetch).not.toHaveBeenCalled()
})

it('does not open unreviewed external deep links as children’s stories', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
  expect(await BookService.fetchFullBookContent('guten-123456')).toBeUndefined()
  expect(await BookService.fetchFullBookContent('api-OL123456W')).toBeUndefined()
  expect(fetch).not.toHaveBeenCalled()
})

it('does not add unreviewed online searches to the child’s shelf', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
  expect(await BookService.fetchOnlineBooks()).toEqual([])
  expect(BookService.getAllAvailableBooks().every(book => book.id.startsWith('cbook-'))).toBe(true)
  expect(fetch).not.toHaveBeenCalled()
})

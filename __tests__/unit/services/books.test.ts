import { afterEach, it, expect, vi } from 'vitest'
import { BookService } from '@/services/books/bookService'
afterEach(() => vi.unstubAllGlobals())

it('opens a Gutenberg deep link without first loading the bookshelf', async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 123456, title: 'A story', authors: [{ name: 'Author' }], formats: { 'text/plain': 'https://example.com/story.txt' } }) })
    .mockResolvedValueOnce({ ok: true, text: async () => 'Once upon a time, a child learned to spell.' })
  vi.stubGlobal('fetch', fetch)
  const book = await BookService.fetchFullBookContent('guten-123456')
  expect(fetch).toHaveBeenNthCalledWith(1, 'https://gutendex.com/books/123456')
  expect(book?.pages[0].content).toContain('Once upon a time')
})

it('opens an Open Library deep link without a cached catalog', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ title: 'A book', description: 'A real description.', covers: [42] }) }))
  const book = await BookService.fetchFullBookContent('api-OL123456W')
  expect(book?.title).toBe('A book')
  expect(book?.pages[0].content).toBe('A real description.')
})

it('returns not found for unknown online IDs and HTTP failures', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  expect(await BookService.fetchFullBookContent('guten-999999')).toBeUndefined()
  expect(await BookService.fetchFullBookContent('api-invalid')).toBeUndefined()
})

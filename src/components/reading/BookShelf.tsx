import React, { useMemo, useState } from 'react'
import { BookService } from '../../services/books/bookService'
import { ChristianBook, christianCategories } from '../../data/books/christianBooks'
import { usePreferences } from '../../hooks/usePreferences'
import BookCard from './BookCard'
import AgeGradeSelector from './AgeGradeSelector'
import './BookShelf.css'

export default function BookShelf({ onSelectBook }: { onSelectBook: (book: ChristianBook) => void }) {
  const [preferences, setPreferences] = usePreferences()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const books = useMemo(() => BookService.getAllAvailableBooks().filter(book =>
    preferences.readingAge >= book.ageRange.min && preferences.readingAge <= book.ageRange.max &&
    book.grades.includes(preferences.readingGrade) &&
    (category === 'all' || book.categories.includes(category) || (category === 'bible-stories' && book.categories.includes('bible'))) &&
    (!search.trim() || `${book.title} ${book.moralThemes.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [preferences.readingAge, preferences.readingGrade, category, search])
  let resume: { bookId?: string; page?: number } = {}
  try { resume = JSON.parse(localStorage.getItem('reading_resume') || '{}') } catch { /* no saved page */ }
  const continued = books.find(b => b.id === resume.bookId)
  return <div className="book-shelf-container">
    {continued && <button className="btn" onClick={() => onSelectBook(continued)}>Continue {continued.title} →</button>}
    <details className="card book-filters"><summary>Choose reading level or find a story</summary>
      <AgeGradeSelector selectedAge={preferences.readingAge} selectedGrade={preferences.readingGrade}
        onSelect={(readingAge, readingGrade) => setPreferences({ readingAge, readingGrade })} />
      <label>Story type<select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">All stories</option>{christianCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select></label>
      <label>Find a story<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try kindness" type="search" /></label>
    </details>
    <p role="status">{books.length} {books.length === 1 ? 'story' : 'stories'} for your reading level</p>
    {books.length ? <div className="books-grid">{books.map(book => <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />)}</div>
      : <div className="card"><p>No stories match yet. Try a different reading level or clear your search.</p><button className="comfort-button" onClick={() => { setSearch(''); setCategory('all') }}>Clear search and story type</button></div>}
  </div>
}

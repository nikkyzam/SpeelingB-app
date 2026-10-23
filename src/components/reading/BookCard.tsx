import React from 'react'
import { ChristianBook } from '../../data/books/christianBooks'
import './BookCard.css'
export default function BookCard({ book, onClick }: { book: ChristianBook; onClick: () => void }) {
  return <button className="book-card story-card" onClick={onClick}>
    <span className="story-cover" aria-hidden>📖</span>
    <span className="story-title">{book.title}</span>
    <span>{book.pages.length} short pages · 🔊 Listen or read</span>
    <span>{book.difficulty === 'beginner' ? 'Short sentences' : book.difficulty === 'intermediate' ? 'Growing readers' : 'Confident readers'}</span>
    <span className="story-open">Open story →</span>
  </button>
}

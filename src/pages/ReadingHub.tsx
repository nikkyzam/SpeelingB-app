import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BookShelf from '../components/reading/BookShelf'
import BookReader from '../components/reading/BookReader'
import './ReadingHub.css'

export default function ReadingHub() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  return <div className="reading-hub">
    {bookId ? <BookReader bookId={bookId} /> : <>
      <h1>Pick a story 📚</h1><p>Short Bible retellings to read or hear together.</p>
      <BookShelf onSelectBook={book => navigate(`/reading/book/${book.id}`)} />
      <details className="card"><summary>Tips for reading together</summary><p>Take turns reading. Talk about a character’s choices, try a new word aloud, and stop whenever you need a break.</p></details>
    </>}
  </div>
}

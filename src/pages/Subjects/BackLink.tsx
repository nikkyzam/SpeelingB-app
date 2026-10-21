import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const navigate = useNavigate()
  return (
    <button type="button" className="sj-back" onClick={() => navigate(to)}>
      ← {label}
    </button>
  )
}

export default BackLink

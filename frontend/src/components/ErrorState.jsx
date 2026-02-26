import React from 'react'

export default function ErrorState({ message = 'Došlo je do greške.', onRetry }) {
  return (
    <div className="error-state">
      <div className="error-message">{message}</div>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Pokušaj ponovo
        </button>
      )}
    </div>
  )
}

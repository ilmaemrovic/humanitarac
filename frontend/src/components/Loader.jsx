import React from 'react'

export default function Loader({ small = false }) {
  return (
    <div className={"loader" + (small ? ' small' : '')} aria-hidden>
      <div className="spinner" />
    </div>
  )
}

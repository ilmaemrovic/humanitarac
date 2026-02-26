import React from 'react'

export default function ActivityCard({ activity }) {
  const date = new Date(activity.date).toLocaleDateString()
  return (
    <article className="card activity-card">
      <h3>{activity.title}</h3>
      <div className="meta">
        <span>{date}</span>
        <span>•</span>
        <span>{activity.city}</span>
        <span>•</span>
        <span className="tag">{activity.category}</span>
      </div>
      <p>{activity.description}</p>
    </article>
  )
}

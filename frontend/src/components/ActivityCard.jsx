import React from 'react'
import { getActivityImage } from '../utils/activityImages'

export default function ActivityCard({ activity }) {
  const date = new Date(activity.date).toLocaleDateString()
  return (
    <article className="card activity-card">
      <div className="card-img-wrapper">
        <img src={getActivityImage(activity)} alt={activity.title} className="card-img" loading="lazy" />
      </div>
      <div className="card-body">
        <h3>{activity.title}</h3>
        <div className="meta">
          <span>{date}</span>
          <span>•</span>
          <span>{activity.city}</span>
          <span>•</span>
          <span className="tag">{activity.category}</span>
        </div>
        <p>{activity.description}</p>
      </div>
    </article>
  )
}

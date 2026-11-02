import type { ReactNode } from 'react'
import { DoodleHeart } from './Doodles'

export function SectionHeading({
  eyebrow,
  strong,
  light,
  aside,
  heart = true,
}: {
  eyebrow: string
  strong: string
  light?: string
  aside?: ReactNode
  heart?: boolean
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          {eyebrow}
          {heart && <DoodleHeart size={40} className="section-heading__heart" />}
        </p>
        <h2>
          <strong>{strong}</strong>
          {light && <> {light}</>}
        </h2>
      </div>
      {aside}
    </div>
  )
}

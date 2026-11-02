// Handgezeichnete Elemente aus dem Template: Herz und Unterstreichung.
export function DoodleHeart({ className, size = 54 }: { className?: string; size?: number }) {
  return (
    <svg className={`doodle ${className ?? ''}`} width={size} height={size} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <path
        d="M30 52C24 44 9 33 8 21c-.8-8.5 7-14 13.5-10.5C26 13 28 18 29 22c1.5-6 5-14 13-15.5 7-1.3 12.5 4.5 10.5 12.5C50 29 40 40 30 52c-1 1.2-2 .4-1.4-.8"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleUnderline({ className }: { className?: string }) {
  return (
    <svg className={`doodle ${className ?? ''}`} viewBox="0 0 220 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M4 12C50 4 120 2 216 7" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

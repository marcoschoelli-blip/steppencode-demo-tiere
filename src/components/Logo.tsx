export function LogoMark({ size = 70 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.86} viewBox="0 0 70 60" aria-hidden="true" className="logo__mark">
      <path
        d="M35 56C14 42 4 31 4 19 4 10 11 3.5 19.5 3.5 26 3.5 31 7 35 12c4-5 9-8.5 15.5-8.5C59 3.5 66 10 66 19c0 12-10 23-31 37z"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g fill="currentColor">
        <ellipse cx="35" cy="31" rx="7" ry="5.8" />
        <ellipse cx="26" cy="23" rx="3.2" ry="3.8" />
        <ellipse cx="31.5" cy="17.5" rx="3.2" ry="3.8" />
        <ellipse cx="38.5" cy="17.5" rx="3.2" ry="3.8" />
        <ellipse cx="44" cy="23" rx="3.2" ry="3.8" />
      </g>
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`logo${light ? ' logo--light' : ''}`} aria-label="Tierschutzverein – zur Startseite">
      <LogoMark />
      <span>Tierschutzverein</span>
    </a>
  )
}

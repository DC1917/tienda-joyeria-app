import { useId } from 'react'

// Dos eslabones entrelazados: cada uno se corta donde pasa por debajo del otro
function Logo({ className = "h-9 w-9" }) {
  const id = 'logo' + useId().replace(/[^a-z0-9]/gi, '')
  const a = <ellipse cx="24" cy="22" rx="11" ry="16" transform="rotate(-30 24 22)" />
  const b = <ellipse cx="36" cy="38" rx="11" ry="16" transform="rotate(-30 36 38)" />
  const corte = (eslabon, cx, cy) => (
    <>
      <rect width="60" height="60" fill="white" />
      <g clipPath={`url(#${id}c${cx})`} stroke="black" strokeWidth="9" fill="none">{eslabon}</g>
      <clipPath id={`${id}c${cx}`}><circle cx={cx} cy={cy} r="5" /></clipPath>
    </>
  )
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="3.5" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <mask id={`${id}a`}>{corte(b, 23.8, 36.1)}</mask>
      <mask id={`${id}b`}>{corte(a, 36.2, 24)}</mask>
      <g mask={`url(#${id}a)`}>{a}</g>
      <g mask={`url(#${id}b)`}>{b}</g>
    </svg>
  )
}

export default Logo

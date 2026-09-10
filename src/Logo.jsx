function Logo({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx="23" cy="19" rx="11.5" ry="16.5"
        transform="rotate(-18 23 19)"
        stroke="currentColor" strokeWidth="3.5"
      />
      <ellipse
        cx="37" cy="41" rx="11.5" ry="16.5"
        transform="rotate(-18 37 41)"
        stroke="currentColor" strokeWidth="3.5"
      />
    </svg>
  )
}

export default Logo

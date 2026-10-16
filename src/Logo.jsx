// Sello de plata: una S grabada dentro de un contraste circular.
// En tamaños chicos el anillo interior y el "925" no se leen, así que solo
// se dibujan con `completo`.
function Logo({ className = "h-9 w-9", completo = false }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="30" cy="30" r="27" strokeWidth={completo ? 1.6 : 2.6} />
      {completo && <circle cx="30" cy="30" r="23" strokeWidth=".7" />}
      <text
        x="30" y={completo ? 37 : 40}
        textAnchor="middle" fill="currentColor" stroke="none"
        fontSize={completo ? 26 : 34} fontStyle="italic"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        S
      </text>
      {completo && (
        <text x="30" y="47" textAnchor="middle" fill="currentColor" stroke="none" fontSize="6" letterSpacing="1.5" style={{ fontFamily: 'var(--font-display)' }}>
          925
        </text>
      )}
    </svg>
  )
}

export default Logo

// Íconos de línea y piezas visuales compartidas
import { useEffect, useRef, useState } from 'react'

// Aparece suavemente cuando entra en pantalla
export function Revelar({ as: Tag = 'div', retraso = 0, className = '', children, ...resto }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <Tag ref={ref} style={{ '--d': `${retraso}ms` }} className={`revelar ${visible ? 'visible' : ''} ${className}`} {...resto}>
      {children}
    </Tag>
  )
}

function Icono({ children, size = 18, grosor = 1.6, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export const IconoBolsa = (p) => <Icono {...p}><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></Icono>
export const IconoChat = (p) => <Icono {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1z" /></Icono>
export const IconoVolver = (p) => <Icono {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Icono>
export const IconoCheck = (p) => <Icono grosor={2} {...p}><path d="M5 12l5 5 9-10" /></Icono>
export const IconoPapelera = (p) => <Icono {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Icono>
export const IconoLapiz = (p) => <Icono {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /></Icono>
export const IconoMas = (p) => <Icono grosor={2} {...p}><path d="M12 5v14M5 12h14" /></Icono>
export const IconoSubir = (p) => <Icono {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" /></Icono>
export const IconoSalir = (p) => <Icono {...p}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></Icono>
export const IconoExterno = (p) => <Icono {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" /></Icono>
export const IconoBuscar = (p) => <Icono {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Icono>
export const IconoCerrar = (p) => <Icono grosor={2} {...p}><path d="M6 6l12 12M18 6L6 18" /></Icono>
export const IconoEscudo = (p) => <Icono grosor={1.5} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></Icono>
export const IconoFicha = (p) => <Icono grosor={1.5} {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></Icono>

export function IconoJoya({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="24" cy="30" r="11" />
      <path d="M19 15l5-6 5 6-5 4z" />
    </svg>
  )
}

// Foto de la pieza con respaldo elegante cuando no hay imagen
export function FotoPieza({ src, alt = '', className = '', zoom = false, iconSize = 40 }) {
  if (!src) {
    return (
      <div className={`bg-foto flex items-center justify-center text-gris-claro ${className}`}>
        <IconoJoya size={iconSize} />
      </div>
    )
  }
  return (
    <div className={`bg-foto overflow-hidden ${zoom ? 'destello' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${zoom ? 'transition-transform duration-700 ease-out group-hover:scale-105' : ''}`}
      />
    </div>
  )
}

// Contador de cantidad (− 1 +)
export function Cantidad({ valor, onMenos, onMas, grande = false }) {
  const alto = grande ? 'h-14' : 'h-11'
  const boton = grande ? 'w-13 h-full' : 'w-11 h-full'
  return (
    <div className={`${alto} border ${grande ? 'border-tinta' : 'border-linea'} rounded-full flex items-center bg-white shrink-0`}>
      <button type="button" onClick={onMenos} aria-label="Quitar una unidad" className={`${boton} text-lg cursor-pointer rounded-l-full hover:bg-marfil`}>−</button>
      <span aria-live="polite" className="w-7 text-center font-semibold">{valor}</span>
      <button type="button" onClick={onMas} aria-label="Agregar una unidad" className={`${boton} text-lg cursor-pointer rounded-r-full hover:bg-marfil`}>+</button>
    </div>
  )
}

export function Cargando({ texto }) {
  return (
    <div className="min-h-[70vh] bg-marfil flex flex-col items-center justify-center gap-4 text-gris-claro">
      <IconoJoya size={36} className="animate-pulse" />
      <p className="text-xs uppercase tracking-[0.2em] text-gris">{texto}</p>
    </div>
  )
}

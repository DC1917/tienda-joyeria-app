import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useCart } from './CartContext'
import { CATEGORIAS } from './config'
import { IconoBolsa } from './ui'
import Logo from './Logo'

function Header() {
  const { carrito } = useCart()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // El panel de administración tiene su propia navegación
  if (location.pathname.startsWith('/admin')) return null

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
  const categoriaActiva = location.pathname === '/' ? (searchParams.get('categoria') || 'Todo') : null

  const claseNav = (activa) =>
    `relative py-2 transition-colors hover:text-plata after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${activa ? 'after:scale-x-100' : 'after:scale-x-0'}`

  return (
    <>
      <div className="bg-tinta text-[#E6E7E9] h-8 sm:h-10 overflow-hidden flex items-center text-[10px] sm:text-xs uppercase tracking-[0.14em]">
        <div className="cinta flex shrink-0 whitespace-nowrap" aria-label="Plata fina ley 925 · Pedidos coordinados directamente por WhatsApp">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} aria-hidden="true" className="flex items-center gap-6 pr-6">
              <span>Plata fina ley 925</span><span className="text-plata">✦</span>
              <span>Pedidos coordinados directamente por WhatsApp</span><span className="text-plata">✦</span>
            </span>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b transition-all duration-500 ${scrolled ? 'bg-white/75 backdrop-blur-xl border-linea shadow-[0_8px_30px_-20px_rgba(28,29,31,0.4)]' : 'bg-white border-linea'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 ${scrolled ? 'sm:h-[72px]' : 'sm:h-[88px]'} transition-[height] duration-500 flex items-center justify-between gap-6`}>
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-9 w-9 sm:h-10 sm:w-10 text-plata group-hover:scale-105 transition-transform duration-300" />
            <span className="flex flex-col">
              <span className="font-display text-[22px] sm:text-[26px] font-semibold tracking-[0.1em] leading-none">SILVER 925</span>
              <span className="text-[8px] sm:text-[10px] tracking-[0.24em] text-gris mt-1">JOYERÍA EN PLATA FINA</span>
            </span>
          </Link>

          <nav aria-label="Categorías" className="hidden lg:flex items-center gap-9 text-sm font-medium">
            <Link to="/" state={{ irAlCatalogo: true }} className={claseNav(categoriaActiva === 'Todo')}>Catálogo</Link>
            {CATEGORIAS.map(c => (
              <Link key={c} to={`/?categoria=${c}`} state={{ irAlCatalogo: true }} className={claseNav(categoriaActiva === c)}>
                {c}
              </Link>
            ))}
          </nav>

          <Link
            to="/carrito"
            aria-label={`Carrito, ${totalItems} ${totalItems === 1 ? 'pieza' : 'piezas'}`}
            className="h-11 px-3 sm:px-[18px] rounded-full bg-tinta text-white flex items-center gap-2.5 text-sm font-semibold hover:bg-black transition-colors"
          >
            <IconoBolsa />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span key={totalItems} className="latido min-w-[22px] h-[22px] px-1.5 rounded-full bg-plata text-white text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>
    </>
  )
}

export default Header

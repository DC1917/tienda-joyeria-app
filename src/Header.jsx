import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useCart } from './CartContext'
import { CATEGORIAS } from './config'
import { IconoBolsa } from './ui'
import Logo from './Logo'

function Header() {
  const { carrito } = useCart()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // El panel de administración tiene su propia navegación
  if (location.pathname.startsWith('/admin')) return null

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
  const categoriaActiva = location.pathname === '/' ? (searchParams.get('categoria') || 'Todo') : null

  const claseNav = (activa) =>
    `py-2 border-b transition-colors hover:text-oro ${activa ? 'border-tinta' : 'border-transparent'}`

  return (
    <>
      <div className="bg-tinta text-[#E9E4D8] h-8 sm:h-10 px-4 flex items-center justify-center gap-6 text-[10px] sm:text-xs uppercase tracking-[0.14em]">
        <span>Plata fina ley 925</span>
        <span className="hidden sm:inline text-gris-claro">·</span>
        <span className="hidden sm:inline">Pedidos coordinados directamente por WhatsApp</span>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-linea">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[88px] flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-9 w-9 sm:h-10 sm:w-10 text-oro group-hover:scale-105 transition-transform duration-300" />
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
              <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-oro text-white text-xs flex items-center justify-center">
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

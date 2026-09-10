import { Link, useLocation } from 'react-router-dom'
import { useCart } from './CartContext'
import Logo from './Logo'

function Header() {
  const { carrito } = useCart()
  const location = useLocation()
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  // Si estamos en cualquier ruta de administración, ocultamos el botón del carrito
  const esAdmin = location.pathname.startsWith('/admin')

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo y Nombre de la Pyme */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="h-9 w-9 text-amber-700 group-hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-950 tracking-tight">
              SILVER <span className="font-light text-gray-500">925</span>
            </h1>
            <span className="-mt-1 text-[10px] md:text-xs font-light text-stone-500 tracking-wider">
              JOYERÍA EN PLATA FINA
            </span>
          </div>
        </Link>

        {/* Enlace al Carrito (Oculto si estamos en el panel de admin) */}
        {!esAdmin && (
          <Link 
            to="/carrito" 
            className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl transition-colors relative group"
          >
            <span className="text-lg">🛒</span>
            <span className="font-medium text-sm text-gray-900 hidden sm:inline">Carrito</span>
            
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        )}
        
      </div>
    </header>
  )
}

export default Header
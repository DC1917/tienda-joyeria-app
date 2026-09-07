import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import logoWhatsapp from './assets/logowhatsapp.png'

function Carrito() {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart()

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const enviarWhatsApp = () => {
    if (carrito.length === 0) return

    // Numero de teléfono de WhatsApp (sin el signo + ni espacios)
    const telefono = "56920807921" 
    
    let mensaje = "Hola! Me interesa coordinar la compra de los siguientes artículos de Silver 925 CL:\n\n"
    
    carrito.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.nombre}* (Cant: ${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-CL')}\n`
    })
    
    mensaje += `\n*Total a coordinar: $${calcularTotal().toLocaleString('es-CL')}*`

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] text-gray-900 py-16 px-6 flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-3xl border border-stone-200/80 shadow-sm text-center max-w-md w-full">
          <span className="text-3xl mb-3 block">🛒</span>
          <h2 className="text-xl font-light font-serif mb-2 text-stone-900">Tu carrito está vacío</h2>
          <p className="text-xs text-stone-500 mb-6 font-light">Explora el catálogo y selecciona las piezas que más te gusten.</p>
          <Link 
            to="/" 
            className="inline-block bg-stone-950 text-white text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-stone-900 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navegación y Título */}
        <Link to="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-6 inline-flex items-center gap-1.5 transition-colors font-medium">
          ← Seguir viendo el catálogo
        </Link>

        <div className="flex justify-between items-end mb-8 border-b border-stone-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-light font-serif tracking-tight text-stone-900">Carrito de Compra</h1>
            <p className="text-xs text-stone-500 mt-1 font-light">Revisa tus piezas antes de coordinar el pedido</p>
          </div>
          <button 
            onClick={vaciarCarrito}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors font-light tracking-wide uppercase"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Listado de Productos */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden mb-8 divide-y divide-stone-100">
          {carrito.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex flex-col">
                <h3 className="font-normal text-stone-900 text-base mb-1">{item.nombre}</h3>
                <p className="text-amber-700 font-semibold text-sm">
                  ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </p>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Control de cantidad */}
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-medium text-stone-900">{item.cantidad}</span>
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Botón eliminar */}
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-xs text-stone-400 hover:text-red-600 transition-colors font-light"
                >
                  Quitar
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Resumen y Botón de WhatsApp */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Total a coordinar</span>
            <span className="text-2xl font-semibold text-amber-700 tracking-tight">
              ${calcularTotal().toLocaleString('es-CL')}
            </span>
          </div>

          <button
            onClick={enviarWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-2xl font-medium tracking-wide text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
          >
            <img src={logoWhatsapp} alt="WhatsApp" className="w-5 h-5 object-contain" />
            <span>Enviar pedido por WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Carrito
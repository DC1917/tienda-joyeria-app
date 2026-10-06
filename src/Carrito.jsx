import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import { fichaCorta, formatoPrecio, linkWhatsApp } from './config'
import { Cantidad, FotoPieza, IconoChat, IconoJoya, IconoPapelera, IconoVolver } from './ui'

function Carrito() {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart()

  const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0)
  const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0)

  const armarMensaje = () => {
    let mensaje = 'Hola! Me interesa coordinar la compra de los siguientes artículos de Silver 925 CL:\n\n'
    carrito.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.nombre}* (Cant: ${item.cantidad}) - ${formatoPrecio(item.precio * item.cantidad)}\n`
    })
    mensaje += `\n*Total a coordinar: ${formatoPrecio(total)}*`
    return mensaje
  }

  const enviarWhatsApp = () => {
    if (carrito.length === 0) return
    window.open(linkWhatsApp(armarMensaje()), '_blank')
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-[70vh] bg-marfil px-4 py-16 flex items-center justify-center">
        <div className="entrada bg-white p-10 rounded border border-linea text-center max-w-md w-full flex flex-col items-center gap-3.5">
          <IconoJoya size={52} className="flotar text-plata mb-1" />
          <h1 className="font-display font-medium text-[32px]">Tu carrito está vacío</h1>
          <p className="text-sm text-gris">Explora el catálogo y elige las piezas que más te gusten.</p>
          <Link to="/" className="mt-2 h-12 px-6 bg-tinta text-white rounded-full flex items-center text-[13px] uppercase tracking-[0.14em] font-bold hover:bg-black transition-colors">
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marfil text-tinta pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <Link to="/" className="mt-6 lg:mt-8 inline-flex items-center gap-2 text-sm font-semibold hover:text-plata transition-colors group entrada">
          <IconoVolver className="transition-transform group-hover:-translate-x-1" />
          Seguir viendo el catálogo
        </Link>

        <div style={{ '--d': '100ms' }} className="entrada pt-6 lg:pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-display font-medium text-[40px] lg:text-[56px] leading-none">Tu carrito</h1>
            <p className="text-sm lg:text-[15px] text-gris">
              {unidades} {unidades === 1 ? 'pieza' : 'piezas'} · Revisa tus piezas antes de coordinar el pedido
            </p>
          </div>
          <button
            type="button"
            onClick={vaciarCarrito}
            className="self-start sm:self-auto h-11 text-[13px] font-semibold text-gris underline hover:text-peligro transition-colors cursor-pointer"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="pt-6 lg:pt-9 grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-6 lg:gap-10 items-start">

          {/* Piezas */}
          <ul className="bg-white border border-linea rounded divide-y divide-linea-suave">
            {carrito.map((item, i) => (
              <li key={item.id} style={{ '--d': `${200 + i * 80}ms` }} className="entrada group hover:bg-marfil/40 transition-colors p-4 sm:px-7 sm:py-6 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6">
                <FotoPieza src={item.fotoPortada} alt="" iconSize={28} zoom className="w-20 h-20 sm:w-[104px] sm:h-[104px] rounded shrink-0" />
                <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                  <Link to={`/producto/${item.id}`} className="text-base sm:text-[17px] font-semibold hover:text-plata">{item.nombre}</Link>
                  {(item.pesoGramos || item.largoCm) && <span className="text-[13px] text-gris">{fichaCorta(item)}</span>}
                  <span className="text-[13px] text-gris">{formatoPrecio(item.precio)} c/u</span>
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <Cantidad
                    valor={item.cantidad}
                    onMenos={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    onMas={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  />
                  <span key={item.cantidad} className="latido sm:w-[110px] text-right text-[17px] font-bold">{formatoPrecio(item.precio * item.cantidad)}</span>
                  <button
                    type="button"
                    onClick={() => eliminarDelCarrito(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-gris hover:text-peligro hover:bg-marfil transition-colors cursor-pointer"
                  >
                    <IconoPapelera />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen */}
          <div style={{ '--d': '300ms' }} className="entrada flex flex-col gap-5 lg:sticky lg:top-28">
            <div className="bg-white border border-linea rounded p-6 lg:p-7 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.2em] text-gris font-semibold">Resumen del pedido</span>
              <div className="flex justify-between text-[15px]"><span className="text-gris">Piezas</span><span>{unidades}</span></div>
              <div className="flex justify-between gap-4 text-[15px]"><span className="text-gris">Envío</span><span className="text-right">Se coordina por WhatsApp</span></div>
              <div className="flex justify-between items-baseline pt-4 border-t border-linea">
                <span className="text-[15px] font-semibold">Total a coordinar</span>
                <span key={total} className="latido inline-block text-[28px] lg:text-[32px] font-bold">{formatoPrecio(total)}</span>
              </div>
              <button
                type="button"
                onClick={enviarWhatsApp}
                className="mt-1 h-[58px] bg-whatsapp hover:bg-whatsapp-oscuro hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(30,122,70,0.7)] active:scale-[0.98] text-white rounded-full flex items-center justify-center gap-3 text-[15px] font-bold transition-all cursor-pointer"
              >
                <IconoChat size={20} />
                Enviar pedido por WhatsApp
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-gris font-semibold">Así llegará tu mensaje</span>
              <p style={{ '--d': '500ms' }} className="entrada bg-[#E7F1E4] shadow-[0_6px_20px_-14px_rgba(28,29,31,0.4)] rounded-[4px_14px_14px_14px] px-[18px] py-4 text-[13px] leading-relaxed whitespace-pre-line">
                {armarMensaje().replace(/\*/g, '')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito

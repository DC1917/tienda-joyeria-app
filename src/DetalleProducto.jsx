import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useCart } from './CartContext'
import { formatoPrecio, linkWhatsApp } from './config'
import { Cantidad, Cargando, FotoPieza, IconoChat, IconoCheck, IconoJoya } from './ui'

function DetalleProducto() {
  const { id } = useParams()
  const { agregarAlCarrito } = useCart()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [agregadas, setAgregadas] = useState(0)

  useEffect(() => {
    async function cargarProducto() {
      const ref = doc(db, 'productos', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProducto({ id: snap.id, ...snap.data() })
      }
      setCargando(false)
    }
    cargarProducto()
  }, [id])

  // Oculta el aviso de "agregado" después de unos segundos
  useEffect(() => {
    if (!agregadas) return
    const t = setTimeout(() => setAgregadas(0), 4000)
    return () => clearTimeout(t)
  }, [agregadas])

  const manejarAgregarCarrito = () => {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      fotoPortada: producto.fotoPortada,
      pesoGramos: producto.pesoGramos,
      largoCm: producto.largoCm,
      ley: producto.ley,
    }, cantidad)
    setAgregadas(cantidad)
    setCantidad(1)
  }

  if (cargando) return <Cargando texto="Cargando pieza..." />

  if (!producto) return (
    <div className="entrada min-h-[70vh] bg-marfil flex flex-col items-center justify-center gap-5 px-6 text-center">
      <IconoJoya size={48} className="flotar text-plata" />
      <h1 className="font-display text-3xl font-medium">Producto no encontrado</h1>
      <Link to="/" className="h-12 px-6 bg-tinta text-white rounded-full flex items-center text-xs uppercase tracking-[0.14em] font-bold">
        Volver al catálogo
      </Link>
    </div>
  )

  // La portada va primero, seguida de la galería
  const galeria = [producto.fotoPortada, ...(producto.fotosGaleria || [])].filter(Boolean)
  const numero = (v) => String(v).replace('.', ',')

  const especificaciones = [
    ['Peso aproximado', producto.pesoGramos ? `${numero(producto.pesoGramos)} g` : '—'],
    ['Largo / medida', producto.largoCm ? `${numero(producto.largoCm)} cm` : '—'],
    ['Ley del material', `Ley ${producto.ley || '925'}`],
  ]

  return (
    <div className="min-h-screen bg-marfil text-tinta pb-32 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Migas de pan */}
        <nav aria-label="Ruta" className="entrada pt-5 lg:pt-8 flex flex-wrap gap-2.5 text-[13px] text-gris">
          <Link to="/" className="hover:text-plata">Catálogo</Link>
          {producto.categoria && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/?categoria=${producto.categoria}`} className="hover:text-plata">{producto.categoria}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-tinta">{producto.nombre}</span>
        </nav>

        <div className="pt-5 lg:pt-7 grid lg:grid-cols-[96px_minmax(0,620px)_minmax(0,1fr)] gap-4 lg:gap-8 items-start">

          {/* Miniaturas */}
          {galeria.length > 1 && (
            <div style={{ '--d': '300ms' }} className="entrada order-2 lg:order-1 flex lg:flex-col gap-2.5 lg:gap-3 overflow-x-auto">
              {galeria.map((foto, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFotoActiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === fotoActiva}
                  className={`w-16 h-16 lg:w-24 lg:h-24 shrink-0 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    i === fotoActiva ? 'border-tinta scale-100' : 'border-transparent opacity-60 scale-95 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Foto principal */}
          <div style={{ '--d': '100ms' }} className={`entrada order-1 lg:order-2 group ${galeria.length > 1 ? '' : 'lg:col-start-2'}`}>
            <FotoPieza key={fotoActiva} src={galeria[fotoActiva]} alt={producto.nombre} zoom iconSize={72} className="fundido aspect-square rounded -mx-4 sm:mx-0" />
          </div>

          {/* Información */}
          <div className="order-3 flex flex-col gap-6 lg:pl-6 pt-2 lg:pt-0">
            <div className="flex flex-col gap-3">
              <span style={{ '--d': '200ms' }} className="entrada flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-plata font-semibold"><span className="h-px w-10 bg-plata" aria-hidden="true" />Plata fina {producto.ley || '925'}</span>
              <h1 style={{ '--d': '280ms' }} className="entrada font-display font-medium text-[38px] lg:text-[56px] leading-none">{producto.nombre}</h1>
              <span style={{ '--d': '360ms' }} className="entrada text-2xl lg:text-[28px] font-bold">{formatoPrecio(producto.precio)}</span>
            </div>

            <dl style={{ '--d': '440ms' }} className="entrada bg-white border border-linea rounded px-5 lg:px-6 py-1 lg:py-2">
              {especificaciones.map(([etiqueta, valor], i) => (
                <div key={etiqueta} className={`group/fila flex justify-between py-3.5 transition-colors hover:text-plata lg:py-4 text-sm lg:text-[15px] ${i < especificaciones.length - 1 ? 'border-b border-linea-suave' : ''}`}>
                  <dt className="text-gris">{etiqueta}</dt>
                  <dd className="font-semibold">{valor}</dd>
                </div>
              ))}
            </dl>

            {/* Cantidad + agregar (barra fija abajo en móvil) */}
            <div className="fixed lg:static inset-x-0 bottom-0 z-30 bg-white/85 backdrop-blur-md lg:backdrop-blur-none lg:bg-transparent border-t border-linea lg:border-0 px-4 pt-3 pb-6 lg:p-0 flex gap-3 items-center">
              <Cantidad
                grande
                valor={cantidad}
                onMenos={() => setCantidad(c => Math.max(1, c - 1))}
                onMas={() => setCantidad(c => c + 1)}
              />
              <button
                type="button"
                onClick={manejarAgregarCarrito}
                className="flex-grow h-14 rounded-full bg-tinta hover:bg-black text-white text-xs lg:text-[13px] uppercase tracking-[0.16em] font-bold hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(28,29,31,0.6)] transition-all active:scale-[0.97] cursor-pointer"
              >
                Agregar al carrito
              </button>
            </div>

            {agregadas > 0 && (
              <div role="status" className="entrada flex items-center justify-between gap-3 bg-exito-fondo border border-exito-borde text-exito-texto px-[18px] py-3.5 rounded text-sm">
                <span className="flex items-center gap-2.5">
                  <IconoCheck />
                  Agregaste {agregadas} {agregadas === 1 ? 'unidad' : 'unidades'} al carrito
                </span>
                <Link to="/carrito" className="font-bold underline shrink-0">Ver carrito</Link>
              </div>
            )}

            <a
              href={linkWhatsApp(`Hola! Me interesa la pieza "${producto.nombre}" (${formatoPrecio(producto.precio)}). ¿Está disponible?`)}
              target="_blank"
              rel="noreferrer"
              className="group/wa h-13 border border-linea bg-white rounded-full flex items-center justify-center gap-2.5 text-sm font-semibold hover:border-whatsapp hover:-translate-y-0.5 transition-all"
            >
              <IconoChat className="text-whatsapp transition-transform group-hover/wa:rotate-[-12deg] group-hover/wa:scale-110" />
              Consultar esta pieza por WhatsApp
            </a>

            <div className="flex flex-col gap-2.5 text-[13px] text-gris pt-4 border-t border-linea">
              <span>Tu pedido se coordina directamente con la tienda por WhatsApp: forma de pago y entrega.</span>
              <span>Calidad garantizada · plata fina ley {producto.ley || '925'}.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto

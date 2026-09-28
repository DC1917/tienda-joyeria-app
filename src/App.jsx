import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { CATEGORIAS, fichaCorta, formatoPrecio, linkWhatsApp } from './config'
import { Cargando, FotoPieza, IconoChat, IconoEscudo, IconoFicha } from './ui'

function TarjetaProducto({ p }) {
  return (
    <Link to={`/producto/${p.id}`} className="group flex flex-col gap-4">
      <FotoPieza src={p.fotoPortada} alt={p.nombre} zoom className="aspect-square rounded" />
      <div className="flex flex-col gap-1.5">
        {p.categoria && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-gris">{p.categoria}</span>
        )}
        <span className="text-[15px] sm:text-[17px] font-medium group-hover:text-oro transition-colors">{p.nombre}</span>
        <span className="text-xs sm:text-[13px] text-gris">{fichaCorta(p)}</span>
        <span className="text-base sm:text-lg font-bold mt-1">{formatoPrecio(p.precio)}</span>
      </div>
    </Link>
  )
}

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const catalogoRef = useRef(null)

  const categoria = searchParams.get('categoria') || 'Todo'

  useEffect(() => {
    async function cargarProductos() {
      const snapshot = await getDocs(collection(db, 'productos'))
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(lista)
      setCargando(false)
    }
    cargarProductos()
  }, [])

  // Al llegar desde el menú de categorías, bajamos directo al catálogo
  useEffect(() => {
    if (!cargando && location.state?.irAlCatalogo) {
      catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.key, location.state, cargando])

  if (cargando) return <Cargando texto="Cargando vitrina..." />

  const visibles = productos.filter(p => p.disponible !== false)
  const filtrados = categoria === 'Todo' ? visibles : visibles.filter(p => p.categoria === categoria)
  const destacado = visibles[0]

  function elegirCategoria(c) {
    setSearchParams(c === 'Todo' ? {} : { categoria: c }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-marfil text-tinta">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-8 lg:py-14 grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
        <div className="order-2 lg:order-1 flex flex-col gap-5 lg:gap-7">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-oro font-semibold">
            Colección plata fina 925
          </span>
          <h1 className="font-display font-medium text-[42px] sm:text-6xl lg:text-[80px] leading-[0.98] tracking-tight">
            Elegancia y diseño único, para todos los días.
          </h1>
          <p className="text-base lg:text-[17px] leading-relaxed text-gris max-w-[480px]">
            Cada pieza con su ficha técnica: peso, largo y ley del material. Arma tu pedido y lo coordinamos contigo por WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={() => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="h-13 px-7 bg-tinta text-white rounded-full text-[13px] uppercase tracking-[0.14em] font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Ver catálogo
            </button>
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              className="h-13 px-6 border border-tinta rounded-full flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-[0.14em] font-semibold hover:bg-white transition-colors"
            >
              <IconoChat />
              Escríbenos
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          {destacado ? (
            <Link to={`/producto/${destacado.id}`} className="group block">
              <FotoPieza src={destacado.fotoPortada} alt={destacado.nombre} zoom iconSize={64} className="h-72 sm:h-[420px] lg:h-[508px] rounded" />
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-white px-[18px] py-3.5 rounded flex flex-col gap-1">
                <span className="text-sm font-semibold">{destacado.nombre}</span>
                <span className="text-xs text-gris">{fichaCorta(destacado)}</span>
              </div>
            </Link>
          ) : (
            <FotoPieza iconSize={64} className="h-72 sm:h-[420px] lg:h-[508px] rounded" />
          )}
        </div>
      </section>

      {/* SELLOS DE CONFIANZA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="border-y border-linea grid sm:grid-cols-3 gap-5 sm:gap-8 py-6 sm:py-7">
          {[
            { Icono: IconoEscudo, titulo: 'Calidad garantizada', texto: 'Plata fina con ley 925' },
            { Icono: IconoFicha, titulo: 'Ficha técnica en cada pieza', texto: 'Peso, largo y ley del material' },
            { Icono: IconoChat, titulo: 'Compra directa por WhatsApp', texto: 'Coordinas tu pedido con la tienda' },
          ].map(({ Icono, titulo, texto }) => (
            <div key={titulo} className="flex items-center gap-3.5">
              <Icono size={24} className="text-oro shrink-0" />
              <span className="flex flex-col gap-0.5">
                <strong className="text-sm font-semibold">{titulo}</strong>
                <span className="text-[13px] text-gris">{texto}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CATÁLOGO */}
      <section ref={catalogoRef} id="catalogo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 lg:pt-[72px] pb-10 flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-display font-medium text-[32px] lg:text-5xl leading-none">Catálogo general</h2>
            <p className="text-sm text-gris">
              {filtrados.length} {filtrados.length === 1 ? 'pieza disponible' : 'piezas disponibles'} · Selecciona una pieza para ver su ficha
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {['Todo', ...CATEGORIAS].map(c => {
              const activa = c === categoria
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => elegirCategoria(c)}
                  className={`shrink-0 h-10 px-[18px] rounded-full border text-[13px] font-semibold transition-colors cursor-pointer ${
                    activa ? 'bg-tinta text-white border-tinta' : 'bg-white text-tinta border-linea hover:border-tinta'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded border border-linea">
            <p className="text-gris text-sm">
              {visibles.length === 0 ? 'No hay joyas publicadas por el momento.' : 'No hay piezas en esta categoría por ahora.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-10">
            {filtrados.map(p => <TarjetaProducto key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* BANNER WHATSAPP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-6 lg:mt-10">
        <div className="bg-tinta text-marfil rounded px-6 py-10 lg:px-16 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <h3 className="font-display font-medium text-3xl lg:text-[40px] leading-tight">¿Buscas una pieza en particular?</h3>
            <p className="text-[15px] text-[#C9C3B7]">Escríbenos y te ayudamos a elegir medida, largo o modelo.</p>
          </div>
          <a
            href={linkWhatsApp('Hola! Estoy buscando una pieza en particular.')}
            target="_blank"
            rel="noreferrer"
            className="h-13 px-6 bg-whatsapp hover:bg-whatsapp-oscuro text-white rounded-full flex items-center justify-center gap-2.5 text-sm font-semibold transition-colors shrink-0"
          >
            <IconoChat />
            Hablar por WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 lg:mt-[72px] py-10 lg:py-12 border-t border-linea flex flex-col sm:flex-row justify-between gap-6 text-[13px] text-gris">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[22px] font-semibold tracking-[0.1em] text-tinta">SILVER 925 CL</span>
          <span>© {new Date().getFullYear()} Silver 925 CL — Calidad garantizada</span>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <button type="button" onClick={() => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-oro cursor-pointer">Catálogo</button>
          <Link to="/carrito" className="hover:text-oro">Carrito</Link>
          <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="hover:text-oro">WhatsApp</a>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp (móvil) */}
      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir por WhatsApp"
        className="lg:hidden fixed right-4 bottom-6 z-30 w-14 h-14 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-[0_6px_18px_rgba(26,26,24,0.25)]"
      >
        <IconoChat size={24} />
      </a>
    </div>
  )
}

export default App

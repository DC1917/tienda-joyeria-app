import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { CATEGORIAS, fichaCorta, formatoPrecio, linkWhatsApp, seguirLuz } from './config'
import Logo from './Logo'
import { Cargando, FotoPieza, IconoChat, Revelar } from './ui'

// Sello circular que gira junto a la foto destacada
function Sello() {
  return (
    <svg viewBox="0 0 120 120" className="girar w-full h-full text-tinta" aria-hidden="true">
      <defs><path id="sello" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
      <text fontSize="9.5" fill="currentColor">
        <textPath href="#sello" textLength="286" lengthAdjust="spacing">PLATA FINA · LEY 925 · SILVER 925 CL ·</textPath>
      </text>
    </svg>
  )
}

function TarjetaProducto({ p, i }) {
  return (
    <Revelar retraso={(i % 4) * 90}>
      <Link
        to={`/producto/${p.id}`}
        onPointerMove={seguirLuz}
        className="luz group block h-full bg-white border border-linea rounded-2xl p-2.5 sm:p-3 transition-all duration-500 hover:border-campo hover:-translate-y-1"
      >
        <div className="relative">
          <FotoPieza src={p.fotoPortada} alt={p.nombre} zoom className="aspect-[4/5] rounded-xl" />
          <span className="absolute left-3 top-3 text-[10px] tracking-[0.2em] text-tinta bg-marfil/70 backdrop-blur px-2.5 py-1 rounded-full">
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="px-1.5 pt-4 pb-2 flex flex-col gap-1">
          {p.categoria && <span className="text-[10px] uppercase tracking-[0.22em] text-gris-claro">{p.categoria}</span>}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
            <span className="font-display text-xl sm:text-[22px] leading-tight">{p.nombre}</span>
            <span className="text-sm sm:text-base font-semibold shrink-0">{formatoPrecio(p.precio)}</span>
          </div>
          <span className="text-xs text-gris">{fichaCorta(p)}</span>
        </div>
      </Link>
    </Revelar>
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
  const irAlCatalogo = () => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })

  function elegirCategoria(c) {
    setSearchParams(c === 'Todo' ? {} : { categoria: c }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-marfil text-tinta overflow-x-clip">

      {/* HERO */}
      <section onPointerMove={seguirLuz} className="luz">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-10 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6 lg:gap-8">
            <span className="entrada flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.32em] text-gris">
              <span className="h-px w-10 bg-plata" aria-hidden="true" />
              Colección plata fina 925
            </span>
            <h1 className="entrada font-display font-medium text-[52px] sm:text-7xl lg:text-[104px] leading-[0.9] tracking-tight" style={{ '--d': '120ms' }}>
              Plata que <br />
              <em className="texto-plata italic">ilumina</em> <br />
              tu día.
            </h1>
            <p className="entrada text-base lg:text-lg leading-relaxed text-gris max-w-[460px]" style={{ '--d': '240ms' }}>
              Cada pieza con su ficha técnica: peso, largo y ley del material. Arma tu pedido y lo coordinamos contigo por WhatsApp.
            </p>
            <div className="entrada flex flex-col sm:flex-row gap-3" style={{ '--d': '360ms' }}>
              <button
                type="button"
                onClick={irAlCatalogo}
                className="h-14 px-8 bg-tinta text-white rounded-full text-[13px] uppercase tracking-[0.16em] font-semibold hover:bg-plata hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(169,193,224,0.55)] transition-all cursor-pointer"
              >
                Ver la vitrina
              </button>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noreferrer"
                className="h-14 px-7 border border-linea rounded-full flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-[0.16em] font-semibold hover:border-tinta transition-colors"
              >
                <IconoChat />
                Escríbenos
              </a>
            </div>
            <dl className="entrada grid grid-cols-3 max-w-md pt-6 border-t border-linea" style={{ '--d': '480ms' }}>
              {[['925', 'Ley de plata'], [visibles.length, visibles.length === 1 ? 'Pieza' : 'Piezas'], ['1:1', 'Atención directa']].map(([n, t]) => (
                <div key={t} className="flex flex-col-reverse gap-1">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-gris-claro">{t}</dt>
                  <dd className="font-display text-3xl lg:text-4xl">{n}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Foto destacada en arco */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-[440px] entrada" style={{ '--d': '200ms' }}>
            <div aria-hidden="true" className="absolute inset-0 translate-x-4 -translate-y-4 rounded-t-full rounded-b-2xl border border-campo" />
            {destacado ? (
              <Link to={`/producto/${destacado.id}`} className="group relative block">
                <FotoPieza src={destacado.fotoPortada} alt={destacado.nombre} zoom iconSize={64} className="aspect-[4/5] rounded-t-full rounded-b-2xl" />
                <div className="flotar absolute -left-3 sm:-left-8 bottom-10 bg-white/80 backdrop-blur-md border border-linea px-5 py-3.5 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-gris-claro">Pieza destacada</span>
                  <span className="font-display text-lg leading-tight">{destacado.nombre}</span>
                  <span className="text-xs text-gris">{formatoPrecio(destacado.precio)} · {fichaCorta(destacado)}</span>
                </div>
              </Link>
            ) : (
              <FotoPieza iconSize={64} className="aspect-[4/5] rounded-t-full rounded-b-2xl" />
            )}
            <div className="absolute -right-2 -top-4 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-marfil/60 backdrop-blur p-1">
              <Sello />
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section ref={catalogoRef} id="catalogo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-24 pb-10 flex flex-col gap-8 lg:gap-12">
        <Revelar className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.32em] text-gris">La vitrina</span>
            <h2 className="font-display font-medium text-5xl lg:text-7xl leading-none">
              {categoria === 'Todo' ? 'Toda la colección' : categoria}
            </h2>
            <p className="text-sm text-gris">
              {filtrados.length} {filtrados.length === 1 ? 'pieza disponible' : 'piezas disponibles'}
            </p>
          </div>
          <div className="flex gap-1 p-1 bg-white border border-linea rounded-full overflow-x-auto w-max max-w-full">
            {['Todo', ...CATEGORIAS].map(c => {
              const activa = c === categoria
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => elegirCategoria(c)}
                  className={`shrink-0 h-10 px-5 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                    activa ? 'bg-tinta text-white' : 'text-gris hover:text-tinta'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </Revelar>

        {filtrados.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-linea">
            <p className="text-gris text-sm">
              {visibles.length === 0 ? 'No hay joyas publicadas por el momento.' : 'No hay piezas en esta categoría por ahora.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtrados.map((p, i) => <TarjetaProducto key={p.id} p={p} i={i} />)}
          </div>
        )}
      </section>

      {/* LLAMADO A WHATSAPP: panel plata sobre la noche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-10 lg:mt-16">
        <Revelar className="relative overflow-hidden bg-tinta text-marfil rounded-3xl px-6 py-14 lg:px-16 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <Logo completo className="absolute -right-10 -bottom-16 w-72 h-72 text-marfil/10" />
          <div className="relative flex flex-col gap-3 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.32em] text-marfil/70">Atención personalizada</span>
            <h3 className="font-display font-medium text-4xl lg:text-6xl leading-[0.95]">¿Buscas una pieza en particular?</h3>
            <p className="text-[15px] text-marfil/80">Escríbenos y te ayudamos a elegir medida, largo o modelo.</p>
          </div>
          <a
            href={linkWhatsApp('Hola! Estoy buscando una pieza en particular.')}
            target="_blank"
            rel="noreferrer"
            className="relative h-14 px-7 bg-whatsapp hover:bg-whatsapp-oscuro hover:-translate-y-0.5 text-[#fff] rounded-full flex items-center justify-center gap-2.5 text-sm font-semibold transition-all shrink-0"
          >
            <IconoChat />
            Hablar por WhatsApp
          </a>
        </Revelar>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 lg:mt-28 border-t border-linea text-gris">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 lg:pt-20 pb-8">
          <Revelar className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-3 text-tinta w-fit group">
                <Logo className="h-10 w-10 transition-transform duration-500 group-hover:scale-105" />
                <span className="font-display text-[26px] font-semibold tracking-[0.1em] leading-none">SILVER 925 CL</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                Joyería en plata fina ley 925. Piezas con ficha técnica y pedidos coordinados directamente contigo.
              </p>
            </div>

            <nav aria-label="Pie de página" className="flex flex-col gap-3 text-sm">
              <span className="text-[11px] uppercase tracking-[0.24em] text-gris-claro font-semibold mb-1">Tienda</span>
              {[['Catálogo', null], ...CATEGORIAS.map(c => [c, c])].map(([texto, cat]) => (
                <Link
                  key={texto}
                  to={cat ? `/?categoria=${cat}` : '/'}
                  state={{ irAlCatalogo: true }}
                  className="w-fit hover:text-tinta hover:translate-x-1 transition-all"
                >
                  {texto}
                </Link>
              ))}
              <Link to="/carrito" className="w-fit hover:text-tinta hover:translate-x-1 transition-all">Carrito</Link>
            </nav>

            <div className="flex flex-col gap-3 text-sm">
              <span className="text-[11px] uppercase tracking-[0.24em] text-gris-claro font-semibold mb-1">Contacto</span>
              <p className="leading-relaxed">¿Dudas sobre una medida o modelo? Escríbenos y te ayudamos.</p>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noreferrer"
                className="mt-1 w-fit h-11 px-5 rounded-full border border-linea text-tinta flex items-center gap-2.5 font-semibold hover:bg-whatsapp hover:border-whatsapp hover:text-[#fff] hover:-translate-y-0.5 transition-all"
              >
                <IconoChat />
                WhatsApp
              </a>
            </div>
          </Revelar>

          <div className="mt-12 lg:mt-16 pt-6 border-t border-linea flex flex-col sm:flex-row justify-between gap-2 text-xs text-gris-claro">
            <span>© {new Date().getFullYear()} Silver 925 CL — Calidad garantizada</span>
            <span className="flex items-center gap-2"><span aria-hidden="true" className="text-plata">✦</span> Plata fina ley 925</span>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp (móvil) */}
      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir por WhatsApp"
        className="lg:hidden fixed right-4 bottom-6 z-30 w-14 h-14 rounded-full bg-whatsapp text-[#fff] flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.5)]"
      >
        <IconoChat size={24} />
      </a>
    </div>
  )
}

export default App

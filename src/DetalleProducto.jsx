import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useCart } from './CartContext'

function DetalleProducto() {
  const { id } = useParams()
  const { agregarAlCarrito } = useCart()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [productoAgregado, setProductoAgregado] = useState(false)

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

  const manejarAgregarCarrito = () => {
    agregarAlCarrito({ id: producto.id, nombre: producto.nombre, precio: producto.precio })
    setProductoAgregado(true)
    setTimeout(() => {
      setProductoAgregado(false)
    }, 2500)
  }

  if (cargando) return (
    <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center">
      <p className="text-stone-400 tracking-[0.2em] text-xs uppercase animate-pulse">Cargando pieza...</p>
    </div>
  )
  
  if (!producto) return (
    <div className="min-h-screen bg-[#f7f7f6] flex flex-col items-center justify-center">
      <p className="text-stone-500 mb-4 font-light">Producto no encontrado.</p>
      <Link to="/" className="text-xs uppercase tracking-widest bg-stone-950 text-white px-5 py-2.5 rounded-xl">Volver al catálogo</Link>
    </div>
  )

  // Aseguramos que la portada vaya primero, seguida de la galería
  const galeria = [
    producto.fotoPortada,
    ...(producto.fotosGaleria || [])
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f7f7f6] py-10 px-6 text-gray-900">
      
      {/* Notificación Pop-up flotante estilo Toast */}
      {productoAgregado && (
        <div className="fixed bottom-6 right-6 bg-stone-950 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-stone-800 animate-bounce">
          <span className="text-amber-500 text-base">✓</span>
          <p className="font-light text-xs tracking-wide">Artículo agregado correctamente al carrito</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Enlace de retorno */}
        <Link to="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-6 inline-flex items-center gap-1.5 transition-colors font-medium">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
          
          {/* COLUMNA IZQUIERDA: FOTOS */}
          <div className="flex flex-col gap-4">
            {/* Foto principal grande */}
            <div className="overflow-hidden rounded-2xl bg-stone-100 aspect-square border border-stone-100 shadow-inner relative group">
              <img 
                src={galeria[fotoActiva]} 
                alt={producto.nombre} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
            </div>

            {/* Galería de miniaturas (si tiene más de 1 foto) */}
            {galeria.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galeria.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoActiva(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                      i === fotoActiva ? 'border-amber-600 scale-95 shadow-md' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN Y ACCIÓN */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 font-medium block mb-2">
                Plata Fina 925
              </span>
              <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight font-serif mb-2">
                {producto.nombre}
              </h1>
              <p className="text-2xl font-medium text-amber-700 tracking-tight mb-6">
                ${producto.precio?.toLocaleString('es-CL')}
              </p>

              {/* Ficha técnica elegante */}
              <div className="bg-[#f7f7f6] p-5 rounded-2xl border border-stone-200/60 mb-8 space-y-2.5">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-3">Especificaciones de la pieza</p>
                <div className="flex justify-between text-sm text-stone-700 border-b border-stone-200/50 pb-2">
                  <span className="font-light">Peso aproximado</span>
                  <span className="font-medium text-stone-900">{producto.pesoGramos} g</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700 border-b border-stone-200/50 pb-2">
                  <span className="font-light">Largo / Medida</span>
                  <span className="font-medium text-stone-900">{producto.largoCm} cm</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700">
                  <span className="font-light">Ley del material</span>
                  <span className="font-medium text-stone-900">Ley {producto.ley}</span>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <button
              onClick={manejarAgregarCarrito}
              className="w-full bg-stone-950 text-white py-4 rounded-xl font-light tracking-widest text-xs uppercase 
                       hover:bg-stone-900 
                       active:scale-[0.98] 
                       transition-all duration-200 
                       cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Agregar al carrito</span>
              <span className="text-amber-500">✦</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DetalleProducto
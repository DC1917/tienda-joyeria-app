import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarProductos() {
      const snapshot = await getDocs(collection(db, 'productos'))
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(lista)
      setCargando(false)
    }
    cargarProductos()
  }, [])

  if (cargando) return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
      <p className="text-stone-400 tracking-[0.2em] text-xs uppercase animate-pulse">Cargando vitrina...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-gray-900 pb-24">
      
      {/* 1. BANNER COMPACTO Y MINIMALISTA */}
      <div className="bg-stone-950 text-stone-100 py-8 px-6 text-center border-b border-stone-800">
        <div className="max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-medium mb-1 block">
            Plata Fina 925
          </span>
          <h2 className="text-xl md:text-2xl font-light tracking-tight font-serif text-stone-100">
            Elegancia y Diseño Único
          </h2>
        </div>
      </div>

      {/* 2. CONTENEDOR DEL CATÁLOGO */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        
        <div className="flex justify-between items-end mb-8 border-b border-stone-200/80 pb-4">
          <div>
            <h3 className="text-xl font-medium tracking-tight text-stone-900 uppercase font-serif">
              Catálogo General
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-light">Selecciona una pieza para ver especificaciones y cotizar</p>
          </div>
          <span className="text-xs font-medium text-stone-600 bg-stone-200/70 px-3 py-1 rounded-full tracking-wider">
            {productos.length} {productos.length === 1 ? 'disponible' : 'disponibles'}
          </span>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-stone-400 font-light text-sm">No hay joyas registradas por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productos.map(p => (
              <Link
                to={`/producto/${p.id}`}
                key={p.id}
                className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-600/30 transition-all duration-500 flex flex-col transform hover:-translate-y-1"
              >
                {/* Contenedor de la imagen con zoom suave */}
                <div className="overflow-hidden aspect-square bg-stone-100 relative">
                  <img
                    src={p.fotoPortada}
                    alt={p.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Información de la joya */}
                <div className="p-5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <h4 className="font-normal text-stone-900 group-hover:text-amber-700 transition-colors text-base mb-1 tracking-tight">
                      {p.nombre}
                    </h4>
                    <p className="text-lg font-medium text-amber-700 tracking-tight">
                      ${p.precio?.toLocaleString('es-CL')}
                    </p>
                  </div>
                  
                  {/* Ficha técnica limpia */}
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] text-stone-500 border-t border-stone-100 pt-3 mt-4 text-center font-light">
                    <span className="bg-stone-50 border border-stone-100 py-1 rounded-md"><strong>{p.pesoGramos || '-'}</strong>g</span>
                    <span className="bg-stone-50 border border-stone-100 py-1 rounded-md"><strong>{p.largoCm || '-'}</strong>cm</span>
                    <span className="bg-stone-50 border border-stone-100 py-1 rounded-md">Ley <strong>{p.ley || '925'}</strong></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer elegante */}
      <footer className="mt-28 border-t border-stone-200/80 pt-8 pb-4 text-center text-xs text-stone-400 tracking-widest uppercase">
        <p>© {new Date().getFullYear()} Silver 925 CL — Calidad garantizada</p>
      </footer>

    </div>
  )
}

export default App
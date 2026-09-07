import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import AdminLogin from './AdminLogin'
import AdminProductos from './AdminProductos'

function AdminPanel() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCargando(false)
    })
    return () => unsubscribe()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center">
        <p className="text-xs tracking-widest uppercase text-stone-500 font-light">Cargando panel...</p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#f7f7f6]">
        <AdminLogin onLogin={() => {}} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera del Panel */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-light font-serif tracking-tight text-stone-900">Panel de Administración</h1>
            <p className="text-xs text-stone-500 mt-1 font-light">Gestiona las piezas y el catálogo de la tienda</p>
          </div>
          <button 
            onClick={() => signOut(auth)} 
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-red-600 transition-colors font-medium cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Componente de Productos */}
        <AdminProductos />

      </div>
    </div>
  )
}

export default AdminPanel
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import AdminLogin from './AdminLogin'
import AdminProductos from './AdminProductos'
import Logo from './Logo'
import { Cargando, IconoExterno, IconoJoya, IconoSalir } from './ui'

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

  if (cargando) return <Cargando texto="Cargando panel..." />

  if (!usuario) return <AdminLogin onLogin={() => {}} />

  return (
    <div className="min-h-screen bg-marfil text-tinta lg:flex">

      {/* Barra lateral (escritorio) */}
      <aside className="hidden lg:flex w-[248px] shrink-0 bg-tinta text-marfil px-5 py-8 flex-col gap-10 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <Logo className="w-9 h-9 text-marfil" />
          <span className="flex flex-col">
            <span className="font-display text-xl font-semibold tracking-[0.1em] leading-none">SILVER 925</span>
            <span className="text-[10px] tracking-[0.2em] text-[#8A8E93] mt-1">ADMINISTRACIÓN</span>
          </span>
        </div>
        <nav aria-label="Panel" className="flex flex-col gap-1">
          <span aria-current="page" className="h-11 px-3.5 rounded bg-[#2A2D33] text-white flex items-center gap-3 text-sm font-semibold">
            <IconoJoya size={18} />
            Productos
          </span>
          <Link to="/" className="h-11 px-3.5 rounded text-[#B4B8BD] hover:text-white flex items-center gap-3 text-sm font-medium">
            <IconoExterno />
            Ver tienda
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-3 px-2 pt-4 border-t border-[#3A3E45]">
          <span className="text-[13px] text-[#B4B8BD] truncate">{usuario.email}</span>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="h-10 flex items-center gap-2.5 text-[13px] font-semibold hover:text-white cursor-pointer"
          >
            <IconoSalir size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Barra superior (móvil) */}
      <div className="lg:hidden bg-tinta text-marfil px-4 h-16 flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-[0.1em]">SILVER 925 · Admin</span>
        <div className="flex items-center gap-1">
          <Link to="/" aria-label="Ver tienda" className="w-11 h-11 flex items-center justify-center"><IconoExterno /></Link>
          <button type="button" onClick={() => signOut(auth)} aria-label="Cerrar sesión" className="w-11 h-11 flex items-center justify-center cursor-pointer"><IconoSalir /></button>
        </div>
      </div>

      <main className="flex-grow min-w-0 px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
        <AdminProductos />
      </main>
    </div>
  )
}

export default AdminPanel

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

  if (cargando) return <p className="text-center mt-10">Cargando...</p>

  if (!usuario) {
    return <AdminLogin onLogin={() => {}} />
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Administrar productos</h1>
        <button onClick={() => signOut(auth)} className="text-red-600 text-sm">
          Cerrar sesión
        </button>
      </div>
      <AdminProductos />
    </div>
  )
}

export default AdminPanel
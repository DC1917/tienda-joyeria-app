import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm max-w-md w-full">
        
        <div className="text-center mb-8">
          <span className="text-2xl mb-2 block">🔒</span>
          <h1 className="text-2xl font-light font-serif tracking-tight text-stone-900">Panel de Administración</h1>
          <p className="text-xs text-stone-500 mt-1 font-light">Ingresa tus credenciales para gestionar el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@silver925.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs text-center font-light">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-stone-950 hover:bg-stone-900 text-white py-4 rounded-2xl font-medium text-xs uppercase tracking-widest transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {cargando ? 'Verificando...' : 'Acceder al panel'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default AdminLogin
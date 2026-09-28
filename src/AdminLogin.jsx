import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'
import Logo from './Logo'

const claseCampo = 'h-13 px-4 border border-campo rounded bg-white text-[15px] text-tinta normal-case tracking-normal font-normal focus:outline-none focus:border-tinta transition-colors'
const claseEtiqueta = 'flex flex-col gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-gris'

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
    } catch {
      setError('Correo o contraseña incorrectos.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 text-tinta">
      {/* Panel de marca */}
      <div className="hidden lg:flex bg-tinta text-marfil px-20 py-16 flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <Logo className="w-10 h-10 text-marfil" />
          <span className="font-display text-[26px] font-semibold tracking-[0.1em]">SILVER 925</span>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="font-display font-medium text-7xl leading-none">Panel de administración</h1>
          <p className="text-base leading-relaxed text-[#C9C3B7] max-w-[440px]">
            Agrega, edita y publica las piezas de la vitrina. Los cambios se ven al instante en la tienda.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-[#9D968A]">Acceso solo para el equipo de la tienda</span>
      </div>

      {/* Formulario */}
      <div className="bg-marfil flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <span className="lg:hidden font-display text-2xl font-semibold tracking-[0.1em] mb-4">SILVER 925</span>
            <h2 className="font-display font-medium text-[40px] leading-none">Iniciar sesión</h2>
            <p className="text-sm text-gris">Ingresa con tu cuenta de administrador.</p>
          </div>

          <label className={claseEtiqueta}>
            Correo
            <input
              type="email"
              autoComplete="email"
              placeholder="admin@silver925.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={claseCampo}
              required
            />
          </label>

          <label className={claseEtiqueta}>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={claseCampo}
              required
            />
          </label>

          {error && (
            <div role="alert" className="px-3.5 py-3 rounded bg-[#FBEFEC] border border-[#EBC9C1] text-peligro text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-1.5 h-[54px] bg-tinta hover:bg-black text-white rounded-full text-[13px] uppercase tracking-[0.16em] font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cargando ? 'Verificando...' : 'Ingresar'}
          </button>
          <Link to="/" className="self-center text-[13px] text-gris underline hover:text-tinta">Volver a la tienda</Link>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

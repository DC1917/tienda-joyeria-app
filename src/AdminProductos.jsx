import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

const CLOUD_NAME = 'lxekw8dr'
const UPLOAD_PRESET = 'n9hprk0h'

async function subirFoto(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  return data.secure_url
}

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [pesoGramos, setPesoGramos] = useState('')
  const [largoCm, setLargoCm] = useState('')
  const [ley, setLey] = useState('925')
  const [precio, setPrecio] = useState('')
  const [archivoPortada, setArchivoPortada] = useState(null)
  const [archivosGaleria, setArchivosGaleria] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function cargarProductos() {
    const snapshot = await getDocs(collection(db, 'productos'))
    setProductos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!archivoPortada) {
      setMensaje('Falta la foto de portada.')
      return
    }
    setSubiendo(true)
    setMensaje('Subiendo fotos a la nube...')

    try {
      const urlPortada = await subirFoto(archivoPortada)

      const urlsGaleria = []
      for (const archivo of archivosGaleria) {
        const url = await subirFoto(archivo)
        urlsGaleria.push(url)
      }

      await addDoc(collection(db, 'productos'), {
        nombre,
        pesoGramos: Number(pesoGramos),
        largoCm: Number(largoCm),
        ley,
        precio: Number(precio),
        fotoPortada: urlPortada,
        fotosGaleria: urlsGaleria,
        disponible: true,
      })

      setMensaje('¡Producto agregado correctamente!')
      setNombre('')
      setPesoGramos('')
      setLargoCm('')
      setLey('925')
      setPrecio('')
      setArchivoPortada(null)
      setArchivosGaleria([])
      cargarProductos()
    } catch (err) {
      setMensaje('Ocurrió un error al guardar el producto.')
    }

    setSubiendo(false)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    await deleteDoc(doc(db, 'productos', id))
    cargarProductos()
  }

  return (
    <div className="space-y-10">
      
      {/* Formulario de Agregar Producto */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
        <h2 className="text-xl font-light font-serif tracking-tight text-stone-900 mb-6">Agregar nueva pieza</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Nombre de la pieza</label>
            <input
              type="text"
              placeholder="Ej: Anillo Solitario de Plata"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Peso (g)</label>
              <input
                type="number"
                placeholder="0.0"
                value={pesoGramos}
                onChange={(e) => setPesoGramos(e.target.value)}
                className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Largo (cm)</label>
              <input
                type="number"
                placeholder="0.0"
                value={largoCm}
                onChange={(e) => setLargoCm(e.target.value)}
                className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Ley</label>
              <input
                type="text"
                placeholder="925"
                value={ley}
                onChange={(e) => setLey(e.target.value)}
                className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 font-medium mb-2">Precio ($ CLP)</label>
            <input
              type="number"
              placeholder="Ej: 24990"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl p-3.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-400 transition-all text-stone-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/30">
              <label className="block text-xs uppercase tracking-widest text-stone-700 font-medium mb-2">Foto de portada *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArchivoPortada(e.target.files[0])}
                className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                required
              />
            </div>

            <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/30">
              <label className="block text-xs uppercase tracking-widest text-stone-700 font-medium mb-2">Fotos galería (opcional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setArchivosGaleria(Array.from(e.target.files))}
                className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
              />
            </div>
          </div>

          {mensaje && (
            <div className="p-3 rounded-xl bg-stone-100 text-stone-800 text-xs text-center font-light">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={subiendo}
            className="w-full bg-stone-950 hover:bg-stone-900 text-white py-4 rounded-2xl font-medium text-xs uppercase tracking-widest transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {subiendo ? 'Guardando en la nube...' : 'Guardar producto'}
          </button>
        </form>
      </div>

      {/* Listado de Productos Cargados */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
        <h2 className="text-xl font-light font-serif tracking-tight text-stone-900 mb-6">
          Catálogo actual ({productos.length})
        </h2>

        {productos.length === 0 ? (
          <p className="text-xs text-stone-500 font-light text-center py-6">No hay productos registrados todavía.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {productos.map(p => (
              <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={p.fotoPortada} alt={p.nombre} className="w-14 h-14 object-cover rounded-2xl border border-stone-100 shadow-xs" />
                  <div>
                    <p className="font-normal text-stone-900 text-sm">{p.nombre}</p>
                    <p className="text-amber-700 text-xs font-semibold mt-0.5">${p.precio?.toLocaleString('es-CL')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleEliminar(p.id)} 
                  className="text-xs text-stone-400 hover:text-red-600 font-light tracking-wide uppercase transition-colors cursor-pointer px-3 py-2"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default AdminProductos
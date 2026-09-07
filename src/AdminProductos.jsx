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
    setMensaje('Subiendo fotos...')

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

      setMensaje('Producto agregado correctamente.')
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
    if (!confirm('¿Eliminar este producto?')) return
    await deleteDoc(doc(db, 'productos', id))
    cargarProductos()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10 border rounded-lg p-5">
        <h2 className="text-lg font-medium">Agregar producto</h2>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Peso (g)"
            value={pesoGramos}
            onChange={(e) => setPesoGramos(e.target.value)}
            className="border rounded-lg p-3"
            required
          />
          <input
            type="number"
            placeholder="Largo (cm)"
            value={largoCm}
            onChange={(e) => setLargoCm(e.target.value)}
            className="border rounded-lg p-3"
            required
          />
          <input
            type="text"
            placeholder="Ley"
            value={ley}
            onChange={(e) => setLey(e.target.value)}
            className="border rounded-lg p-3"
            required
          />
        </div>

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1">Foto de portada</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivoPortada(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fotos adicionales (2 a 4)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setArchivosGaleria(Array.from(e.target.files))}
            className="w-full"
          />
        </div>

        {mensaje && <p className="text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={subiendo}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {subiendo ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>

      <h2 className="text-lg font-medium mb-4">Productos cargados ({productos.length})</h2>
      <div className="space-y-3">
        {productos.map(p => (
          <div key={p.id} className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <img src={p.fotoPortada} alt={p.nombre} className="w-14 h-14 object-cover rounded" />
              <div>
                <p className="font-medium">{p.nombre}</p>
                <p className="text-gray-600 text-sm">${p.precio?.toLocaleString('es-CL')}</p>
              </div>
            </div>
            <button onClick={() => handleEliminar(p.id)} className="text-red-600 text-sm">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProductos
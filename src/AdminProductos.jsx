import { useEffect, useMemo, useRef, useState } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { CATEGORIAS, fichaCorta, formatoPrecio } from './config'
import { FotoPieza, IconoBuscar, IconoCerrar, IconoLapiz, IconoMas, IconoPapelera, IconoSubir } from './ui'

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

const claseEtiqueta = 'flex flex-col gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gris'
const claseCampo = 'w-full h-12 px-3.5 border border-campo rounded bg-white text-[15px] text-tinta normal-case tracking-normal font-normal focus:outline-none focus:border-tinta transition-colors'

// Vista previa local de un archivo elegido
function usePrevia(archivo) {
  const url = useMemo(() => (archivo ? URL.createObjectURL(archivo) : ''), [archivo])
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
  return url
}

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pesoGramos, setPesoGramos] = useState('')
  const [largoCm, setLargoCm] = useState('')
  const [ley, setLey] = useState('925')
  const [precio, setPrecio] = useState('')
  const [archivoPortada, setArchivoPortada] = useState(null)
  const [archivosGaleria, setArchivosGaleria] = useState([])

  // Estados para controlar el modo de edición
  const [editandoId, setEditandoId] = useState(null)
  const [disponibleActual, setDisponibleActual] = useState(true)
  const [fotoPortadaActual, setFotoPortadaActual] = useState('')
  const [fotosGaleriaActual, setFotosGaleriaActual] = useState([])

  const [subiendo, setSubiendo] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', error: false })
  const [formKey, setFormKey] = useState(0) // reinicia los <input type="file">
  const formRef = useRef(null)

  const previaPortada = usePrevia(archivoPortada)

  async function cargarProductos() {
    const snapshot = await getDocs(collection(db, 'productos'))
    setProductos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  function irAlFormulario() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Cargar datos en el formulario al hacer clic en "Editar"
  function iniciarEdicion(p) {
    setEditandoId(p.id)
    setNombre(p.nombre || '')
    setCategoria(p.categoria || '')
    setPesoGramos(p.pesoGramos || '')
    setLargoCm(p.largoCm || '')
    setLey(p.ley || '925')
    setPrecio(p.precio || '')
    setDisponibleActual(p.disponible !== false)
    setFotoPortadaActual(p.fotoPortada || '')
    setFotosGaleriaActual(p.fotosGaleria || [])
    setArchivoPortada(null)
    setArchivosGaleria([])
    setFormKey(k => k + 1)
    setMensaje({ texto: '', error: false })
    irAlFormulario()
  }

  // Cancelar edición y limpiar formulario
  function limpiarFormulario() {
    setEditandoId(null)
    setNombre('')
    setCategoria('')
    setPesoGramos('')
    setLargoCm('')
    setLey('925')
    setPrecio('')
    setDisponibleActual(true)
    setFotoPortadaActual('')
    setFotosGaleriaActual([])
    setArchivoPortada(null)
    setArchivosGaleria([])
    setFormKey(k => k + 1)
  }

  function cancelarEdicion() {
    limpiarFormulario()
    setMensaje({ texto: '', error: false })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!editandoId && !archivoPortada) {
      setMensaje({ texto: 'Falta la foto de portada.', error: true })
      return
    }

    setSubiendo(true)
    setMensaje({ texto: editandoId ? 'Actualizando producto...' : 'Subiendo fotos a la nube...', error: false })

    try {
      let urlPortada = fotoPortadaActual
      if (archivoPortada) {
        urlPortada = await subirFoto(archivoPortada)
      }

      const urlsGaleria = [...fotosGaleriaActual]
      for (const archivo of archivosGaleria) {
        const url = await subirFoto(archivo)
        urlsGaleria.push(url)
      }

      const datosProducto = {
        nombre,
        categoria,
        pesoGramos: Number(pesoGramos),
        largoCm: Number(largoCm),
        ley,
        precio: Number(precio),
        fotoPortada: urlPortada,
        fotosGaleria: urlsGaleria,
        disponible: editandoId ? disponibleActual : true,
      }

      if (editandoId) {
        await updateDoc(doc(db, 'productos', editandoId), datosProducto)
      } else {
        await addDoc(collection(db, 'productos'), datosProducto)
      }

      limpiarFormulario()
      setMensaje({ texto: editandoId ? '¡Producto actualizado correctamente!' : '¡Producto agregado correctamente!', error: false })
      cargarProductos()
    } catch {
      setMensaje({ texto: 'Ocurrió un error al guardar el producto.', error: true })
    }

    setSubiendo(false)
  }

  async function handleEliminar(p) {
    if (!confirm(`¿Estás seguro de eliminar "${p.nombre}"?`)) return
    await deleteDoc(doc(db, 'productos', p.id))
    if (editandoId === p.id) cancelarEdicion()
    cargarProductos()
  }

  // Mostrar / ocultar en la tienda
  async function alternarDisponible(p) {
    const nuevo = p.disponible === false
    setProductos(prev => prev.map(x => (x.id === p.id ? { ...x, disponible: nuevo } : x)))
    if (editandoId === p.id) setDisponibleActual(nuevo)
    try {
      await updateDoc(doc(db, 'productos', p.id), { disponible: nuevo })
    } catch {
      setProductos(prev => prev.map(x => (x.id === p.id ? { ...x, disponible: !nuevo } : x)))
    }
  }

  const visibles = productos.filter(p => p.disponible !== false).length
  const listado = productos.filter(p => (p.nombre || '').toLowerCase().includes(busqueda.trim().toLowerCase()))

  return (
    <div className="flex flex-col gap-7 max-w-[1400px]">

      {/* Encabezado */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display font-medium text-[40px] lg:text-5xl leading-none">Productos</h1>
          <p className="text-sm text-gris">
            {productos.length} {productos.length === 1 ? 'pieza' : 'piezas'} en el catálogo · {visibles} visibles en la tienda
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <label className="h-11 sm:w-[280px] border border-campo rounded-full bg-white flex items-center gap-2.5 px-4 text-gris focus-within:border-tinta">
            <IconoBuscar size={16} />
            <span className="sr-only">Buscar pieza</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pieza"
              className="flex-grow min-w-0 bg-transparent outline-none text-sm text-tinta"
            />
          </label>
          <button
            type="button"
            onClick={() => { cancelarEdicion(); irAlFormulario() }}
            className="h-11 px-5 rounded-full bg-tinta hover:bg-black text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <IconoMas size={16} />
            Nueva pieza
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_440px] gap-7 items-start">

        {/* Formulario de agregar / editar */}
        <form
          ref={formRef}
          key={formKey}
          onSubmit={handleSubmit}
          className="xl:order-2 xl:sticky xl:top-8 scroll-mt-6 bg-white border border-linea rounded p-5 sm:p-7 flex flex-col gap-[18px]"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display font-medium text-[30px] leading-tight">
              {editandoId ? 'Editar pieza' : 'Agregar nueva pieza'}
            </h2>
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} className="h-9 text-[13px] font-semibold text-gris underline hover:text-tinta cursor-pointer shrink-0">
                Cancelar edición
              </button>
            )}
          </div>

          <label className={claseEtiqueta}>
            Nombre de la pieza
            <input type="text" placeholder="Ej: Anillo Solitario de Plata" value={nombre} onChange={(e) => setNombre(e.target.value)} className={claseCampo} required />
          </label>

          <label className={claseEtiqueta}>
            Categoría
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={claseCampo}>
              <option value="">Sin categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className={claseEtiqueta}>
              Peso (g)
              <input type="number" step="any" min="0" placeholder="0.0" value={pesoGramos} onChange={(e) => setPesoGramos(e.target.value)} className={claseCampo} required />
            </label>
            <label className={claseEtiqueta}>
              Largo (cm)
              <input type="number" step="any" min="0" placeholder="0.0" value={largoCm} onChange={(e) => setLargoCm(e.target.value)} className={claseCampo} required />
            </label>
            <label className={claseEtiqueta}>
              Ley
              <input type="text" placeholder="925" value={ley} onChange={(e) => setLey(e.target.value)} className={claseCampo} required />
            </label>
          </div>

          <label className={claseEtiqueta}>
            Precio (CLP)
            <input type="number" min="0" placeholder="Ej: 24990" value={precio} onChange={(e) => setPrecio(e.target.value)} className={claseCampo} required />
          </label>

          {/* Portada */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-gris">
              {editandoId ? 'Cambiar foto de portada (opcional)' : 'Foto de portada *'}
            </span>
            <label className="min-h-[120px] border border-dashed border-[#A9AEB4] rounded bg-[#FAFAF9] hover:border-tinta flex items-center gap-4 p-4 text-gris text-[13px] cursor-pointer transition-colors">
              {(previaPortada || fotoPortadaActual) ? (
                <img src={previaPortada || fotoPortadaActual} alt="" className="w-20 h-20 object-cover rounded shrink-0" />
              ) : (
                <span className="w-20 h-20 rounded bg-foto flex items-center justify-center shrink-0"><IconoSubir size={24} /></span>
              )}
              <span className="flex flex-col gap-1">
                <strong className="text-tinta font-semibold">
                  {archivoPortada ? archivoPortada.name : (fotoPortadaActual ? 'Reemplazar foto principal' : 'Sube la foto principal')}
                </strong>
                <span>JPG o PNG, idealmente cuadrada</span>
              </span>
              <input type="file" accept="image/*" onChange={(e) => setArchivoPortada(e.target.files[0] || null)} className="sr-only" />
            </label>
          </div>

          {/* Galería */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-gris">Galería</span>
            <div className="grid grid-cols-4 gap-2">
              {fotosGaleriaActual.map((url) => (
                <div key={url} className="relative aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFotosGaleriaActual(prev => prev.filter(u => u !== url))}
                    aria-label="Quitar foto de la galería"
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-tinta text-white flex items-center justify-center cursor-pointer"
                  >
                    <IconoCerrar size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-[#A9AEB4] rounded flex flex-col items-center justify-center gap-1 text-gris hover:border-tinta cursor-pointer transition-colors">
                <IconoMas size={20} />
                <span className="text-[10px] font-semibold">
                  {archivosGaleria.length ? `${archivosGaleria.length} nueva(s)` : 'Agregar'}
                </span>
                <input type="file" accept="image/*" multiple onChange={(e) => setArchivosGaleria(Array.from(e.target.files))} className="sr-only" />
              </label>
            </div>
          </div>

          {mensaje.texto && (
            <div
              role="status"
              className={`px-3.5 py-3 rounded text-[13px] text-center border ${
                mensaje.error ? 'bg-[#FBEFEC] border-[#EBC9C1] text-peligro' : 'bg-exito-fondo border-exito-borde text-exito-texto'
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          <button
            type="submit"
            disabled={subiendo}
            className="mt-1 h-[54px] rounded-full bg-tinta hover:bg-black text-white text-[13px] uppercase tracking-[0.16em] font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {subiendo ? 'Guardando en la nube...' : (editandoId ? 'Actualizar producto' : 'Guardar producto')}
          </button>
        </form>

        {/* Listado de productos */}
        <div className="xl:order-1 bg-white border border-linea rounded">
          <div className="hidden md:grid grid-cols-[minmax(0,1fr)_110px_80px_100px] gap-4 px-5 py-3.5 border-b border-linea text-[11px] uppercase tracking-[0.14em] text-gris font-semibold">
            <span>Pieza</span><span>Precio</span><span>Visible</span><span className="text-right">Acciones</span>
          </div>

          {listado.length === 0 ? (
            <p className="text-sm text-gris text-center py-12">
              {productos.length === 0 ? 'No hay productos registrados todavía.' : 'Ninguna pieza coincide con la búsqueda.'}
            </p>
          ) : (
            <ul className="divide-y divide-linea-suave">
              {listado.map(p => {
                const visible = p.disponible !== false
                return (
                  <li
                    key={p.id}
                    className={`px-4 sm:px-5 py-3 grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_110px_80px_100px] gap-x-4 gap-y-2 items-center ${
                      editandoId === p.id ? 'bg-[#F1F3F5]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 col-span-2 md:col-span-1">
                      <FotoPieza src={p.fotoPortada} alt="" iconSize={20} className="w-12 h-12 rounded shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-sm truncate">{p.nombre}</span>
                        <span className="text-xs text-gris truncate">
                          {[p.categoria, fichaCorta(p), `${(p.fotosGaleria?.length || 0) + 1} fotos`].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{formatoPrecio(p.precio)}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={visible}
                      aria-label={`Mostrar ${p.nombre} en la tienda`}
                      onClick={() => alternarDisponible(p)}
                      className={`hidden md:flex w-12 h-7 rounded-full p-[3px] transition-colors cursor-pointer ${visible ? 'bg-whatsapp justify-end' : 'bg-[#C9CDD2] justify-start'}`}
                    >
                      <span className="w-[22px] h-[22px] rounded-full bg-white block" />
                    </button>
                    <div className="flex justify-end gap-1 col-start-2 row-start-2 md:col-start-auto md:row-start-auto">
                      <button
                        type="button"
                        onClick={() => alternarDisponible(p)}
                        className="md:hidden h-11 px-3 text-xs font-semibold text-gris underline cursor-pointer"
                      >
                        {visible ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(p)}
                        aria-label={`Editar ${p.nombre}`}
                        className="w-11 h-11 rounded-full border border-linea bg-white hover:border-tinta flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <IconoLapiz size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(p)}
                        aria-label={`Eliminar ${p.nombre}`}
                        className="w-11 h-11 rounded-full text-peligro hover:bg-[#FBEFEC] flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <IconoPapelera size={16} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProductos

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
const CART_STORAGE_KEY = 'silver925_carrito'

function cargarCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CART_STORAGE_KEY)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(cargarCarritoGuardado)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito))
    } catch {
      // Sin almacenamiento disponible (modo privado): el carrito sigue funcionando en memoria
    }
  }, [carrito])

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id)
      if (existente) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  function quitarDelCarrito(id) {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return
    setCarrito(prev => prev.map(item => (item.id === id ? { ...item, cantidad } : item)))
  }

  function vaciarCarrito() {
    setCarrito([])
  }

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      actualizarCantidad: cambiarCantidad, 
      eliminarDelCarrito: quitarDelCarrito, 
      vaciarCarrito 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

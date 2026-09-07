import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  function agregarAlCarrito(producto) {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id)
      if (existente) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
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
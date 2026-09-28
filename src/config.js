// Configuración y utilidades compartidas de la tienda

// Número de WhatsApp de la tienda (sin + ni espacios)
export const TELEFONO_WHATSAPP = '56920807921'

export const CATEGORIAS = ['Anillos', 'Cadenas', 'Aros', 'Pulseras']

export function formatoPrecio(valor) {
  return '$' + (Number(valor) || 0).toLocaleString('es-CL')
}

export function linkWhatsApp(texto = '') {
  const base = `https://wa.me/${TELEFONO_WHATSAPP}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}

// "6,8 g · 50 cm · Ley 925" (omite los datos vacíos)
export function fichaCorta(p) {
  const partes = []
  if (p.pesoGramos) partes.push(`${String(p.pesoGramos).replace('.', ',')} g`)
  if (p.largoCm) partes.push(`${String(p.largoCm).replace('.', ',')} cm`)
  partes.push(`Ley ${p.ley || '925'}`)
  return partes.join(' · ')
}

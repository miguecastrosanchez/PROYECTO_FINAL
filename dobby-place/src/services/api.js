// Toda la comunicación HTTP queda centralizada aquí.
// VITE_API_URL se configura en Netlify; en desarrollo usamos Express local.
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export async function api(ruta, { method = "GET", body, token } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("No se pudo conectar con la API. Verifica que el backend esté disponible.");
  }
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(data.error || `Error HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }
  return data;
}

export const imagenPorDefecto = "https://placehold.co/500x600/F2E6DC/171717?text=DOBBY+PLACE";

// Transformamos el contrato de la API (inglés) al formato usado por los componentes (español).
export function mapearPublicacion(p) {
  return {
    id: Number(p.id),
    usuarioId: Number(p.usuario_id),
    titulo: p.title,
    descripcion: p.description,
    precio: Number(p.price),
    categoria: p.category,
    talla: p.size,
    lugar: p.place,
    imagen: p.image_url || imagenPorDefecto,
    vendedor: p.seller_name || "",
  };
}

export function prepararPublicacion(p) {
  return {
    title: p.titulo.trim(),
    description: p.descripcion.trim(),
    price: Number(p.precio),
    category: p.categoria,
    size: p.talla,
    place: p.lugar.trim(),
    image_url: p.imagen?.trim() || null,
  };
}

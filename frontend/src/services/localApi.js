// =============================================
// Servicio para JSON Server (Backend Local)
// CRUD de favoritos en http://localhost:3001
// =============================================

const BASE_URL = '/api/favorites'

// Headers comunes
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const message = `Error ${response.status}: ${response.statusText}`
    throw new Error(message)
  }
  // DELETE devuelve 200 sin body en json-server 0.17
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}

// ── CRUD Operations ────────────────────────────

// READ — Obtener todos los favoritos
export const getFavorites = async () => {
  const response = await fetch(BASE_URL)
  return handleResponse(response)
}

// READ — Obtener un favorito por ID
export const getFavoriteById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleResponse(response)
}

// CREATE — Agregar nuevo favorito
export const createFavorite = async (data) => {
  // Spread para agregar timestamp
  const body = {
    ...data,
    createdAt: new Date().toISOString()
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body)
  })

  return handleResponse(response)
}

// UPDATE — Actualizar favorito existente
export const updateFavorite = async (id, data) => {
  const body = {
    ...data,
    updatedAt: new Date().toISOString()
  }

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body)
  })

  return handleResponse(response)
}

// DELETE — Eliminar favorito
export const deleteFavorite = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

// =============================================
// Utilidades para LocalStorage
// Persistencia de datos entre sesiones
// =============================================

/**
 * Guarda un valor en LocalStorage (serializado como JSON)
 * @param {string} key - Clave de almacenamiento
 * @param {*} value - Valor a guardar
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.warn(`[LocalStorage] Error al guardar "${key}":`, error)
  }
}

/**
 * Recupera un valor de LocalStorage (deserializado de JSON)
 * @param {string} key - Clave a buscar
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} El valor almacenado o defaultValue
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.warn(`[LocalStorage] Error al leer "${key}":`, error)
    return defaultValue
  }
}

/**
 * Elimina un item de LocalStorage
 * @param {string} key - Clave a eliminar
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[LocalStorage] Error al eliminar "${key}":`, error)
  }
}

/**
 * Limpia todo el LocalStorage de la app (prefijado)
 */
export const clearAppStorage = () => {
  const appKeys = ['selectedCategory', 'recentSearches', 'darkMode']
  appKeys.forEach(key => removeFromLocalStorage(key))
}

/**
 * Verifica si LocalStorage está disponible
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__ls_test__'
    localStorage.setItem(test, '1')
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

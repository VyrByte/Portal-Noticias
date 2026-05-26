import { createStore } from 'vuex'
import { fetchNewsFromAPI } from '@/services/newsApi.js'
import {
  getFavorites,
  createFavorite,
  updateFavorite,
  deleteFavorite
} from '@/services/localApi.js'
import {
  saveToLocalStorage,
  getFromLocalStorage
} from '@/utils/localStorage.js'

// =============================================
// VUEX STORE — Noticias Wicho
// state, mutations, actions, getters (ES6+)
// =============================================

export default createStore({
  // ── STATE ──────────────────────────────────
  state: {
    news: [],
    favorites: [],
    searchQuery: '',
    selectedCategory: getFromLocalStorage('selectedCategory') || 'general',
    recentSearches: getFromLocalStorage('recentSearches') || [],
    loading: false,
    favoritesLoading: false,
    error: null,
    currentPage: 1,
    totalResults: 0
  },

  // ── MUTATIONS ──────────────────────────────
  mutations: {
    SET_NEWS(state, { articles, total }) {
      // Spread para no mutar el argumento original
      state.news = [...articles]
      state.totalResults = total
    },

    SET_FAVORITES(state, favorites) {
      state.favorites = [...favorites]
    },

    ADD_FAVORITE(state, favorite) {
      state.favorites = [...state.favorites, favorite]
    },

    UPDATE_FAVORITE(state, updatedFavorite) {
      state.favorites = state.favorites.map(fav =>
        fav.id === updatedFavorite.id ? { ...fav, ...updatedFavorite } : fav
      )
    },

    DELETE_FAVORITE(state, id) {
      state.favorites = state.favorites.filter(fav => fav.id !== id)
    },

    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },

    SET_CATEGORY(state, category) {
      state.selectedCategory = category
      saveToLocalStorage('selectedCategory', category)
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_FAVORITES_LOADING(state, loading) {
      state.favoritesLoading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_PAGE(state, page) {
      state.currentPage = page
    },

    ADD_RECENT_SEARCH(state, query) {
      if (!query.trim()) return
      // Desestructuración + spread para actualizar búsquedas recientes
      const filtered = state.recentSearches.filter(s => s !== query)
      state.recentSearches = [query, ...filtered].slice(0, 8)
      saveToLocalStorage('recentSearches', state.recentSearches)
    },

    CLEAR_RECENT_SEARCHES(state) {
      state.recentSearches = []
      saveToLocalStorage('recentSearches', [])
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  // ── ACTIONS ────────────────────────────────
  actions: {
    // Consume la API externa de noticias
    async fetchNews({ commit, state }, { category, page } = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const currentCategory = category || state.selectedCategory
        const currentPage = page || state.currentPage

        const { articles, totalArticles } = await fetchNewsFromAPI({
          category: currentCategory,
          page: currentPage
        })

        commit('SET_NEWS', { articles, total: totalArticles })
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al cargar las noticias')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Cambia categoría y recarga noticias
    async changeCategory({ commit, dispatch }, category) {
      commit('SET_CATEGORY', category)
      commit('SET_PAGE', 1)
      await dispatch('fetchNews', { category, page: 1 })
    },

    // ── CRUD Favoritos (JSON Server) ──────────
    async fetchFavorites({ commit }) {
      commit('SET_FAVORITES_LOADING', true)
      try {
        const data = await getFavorites()
        commit('SET_FAVORITES', data)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al cargar favoritos')
      } finally {
        commit('SET_FAVORITES_LOADING', false)
      }
    },

    async addFavorite({ commit }, favoriteData) {
      try {
        // Rest operator: extrae campos específicos, el resto va al body
        const { ...body } = favoriteData
        const newFav = await createFavorite(body)
        commit('ADD_FAVORITE', newFav)
        return newFav
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al guardar favorito')
        throw error
      }
    },

    async editFavorite({ commit }, favoriteData) {
      try {
        const { id, ...rest } = favoriteData // Desestructuración ES6
        const updated = await updateFavorite(id, rest)
        commit('UPDATE_FAVORITE', updated)
        return updated
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al actualizar favorito')
        throw error
      }
    },

    async removeFavorite({ commit }, id) {
      try {
        await deleteFavorite(id)
        commit('DELETE_FAVORITE', id)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al eliminar favorito')
        throw error
      }
    },

    // Búsqueda con persistencia
    searchNews({ commit }, query) {
      commit('SET_SEARCH_QUERY', query)
      if (query.trim()) {
        commit('ADD_RECENT_SEARCH', query.trim())
      }
    }
  },

  // ── GETTERS ────────────────────────────────
  getters: {
    // Filtra noticias por búsqueda (funciones flecha ES6)
    filteredNews: (state) => {
      const query = state.searchQuery.toLowerCase().trim()
      if (!query) return state.news
      return state.news.filter(({ title = '', description = '' }) =>
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      )
    },

    // Cuenta total de favoritos
    totalFavorites: (state) => state.favorites.length,

    // Verifica si un artículo ya es favorito
    isFavorite: (state) => (articleTitle) =>
      state.favorites.some(fav => fav.title === articleTitle),

    // Noticias agrupadas por categoría (para estadísticas)
    newsByCategory: (state) => {
      return state.news.reduce((acc, article) => {
        const cat = article.category || 'general'
        return { ...acc, [cat]: [...(acc[cat] || []), article] }
      }, {})
    },

    // Estado de carga combinado
    isLoading: (state) => state.loading || state.favoritesLoading
  }
})

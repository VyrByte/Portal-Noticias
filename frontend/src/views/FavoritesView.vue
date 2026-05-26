<template>
  <div class="page">
    <!-- Header -->
    <header class="fav-header">
      <div>
        <h1 class="fav-title">
          <svg class="header-svg-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Mis Favoritos
        </h1>
        <p class="fav-subtitle">
          {{ favorites.length > 0
            ? `${favorites.length} noticia${favorites.length !== 1 ? 's' : ''} guardada${favorites.length !== 1 ? 's' : ''}`
            : 'Aún no tienes noticias guardadas' }}
        </p>
      </div>
      <router-link to="/create" class="btn btn-primary" id="fav-create-btn">
        <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="stroke: white; margin-right: 0.25rem;">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
        Nueva Noticia
      </router-link>
    </header>

    <!-- Estado: cargando -->
    <Spinner
      v-if="favoritesLoading"
      message="Cargando favoritos..."
      size="md"
      :full-screen="true"
    />

    <!-- Estado: error -->
    <ErrorMessage
      v-else-if="error"
      title="Error al cargar favoritos"
      :message="error"
      @retry="loadFavorites"
    />

    <!-- Lista de favoritos -->
    <main v-else-if="favorites.length > 0">
      <!-- Barra de búsqueda interna -->
      <div class="fav-search-bar">
        <SearchBar
          v-model="searchQuery"
          placeholder="Buscar en mis favoritos..."
          @search="val => searchQuery = val"
        />
      </div>

      <!-- Grid de favoritos -->
      <div class="news-grid" v-if="filteredFavorites.length > 0">
        <div
          v-for="(fav, i) in filteredFavorites"
          :key="fav.id"
          class="fav-item"
          :id="`fav-item-${fav.id}`"
        >
          <!-- Card de favorito (adaptada) -->
          <div class="fav-card" @click="openDetail(fav)" role="button" tabindex="0">
            <div class="fav-card-image">
              <img
                :src="fav.image || fallback"
                :alt="fav.title"
                @error="e => e.target.src = fallback"
              />
              <span :class="['badge', `badge-${fav.category || 'general'}`]" class="fav-badge">
                {{ categoryLabel(fav.category) }}
              </span>
            </div>
            <div class="fav-card-body">
              <div class="fav-card-meta">
                <span class="fav-source">{{ fav.source }}</span>
                <span class="fav-dot">·</span>
                <time>{{ formatDate(fav.publishedAt || fav.createdAt) }}</time>
              </div>
              <h3 class="fav-card-title">{{ fav.title }}</h3>
              <p class="fav-card-desc">{{ truncate(fav.description) }}</p>
            </div>
          </div>

          <!-- Acciones CRUD -->
          <div class="fav-actions">
            <button
              class="btn btn-secondary btn-sm"
              :id="`edit-fav-${fav.id}`"
              @click.stop="openEdit(fav)"
              title="Editar"
            >
              <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.2rem;">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
              Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              :id="`delete-fav-${fav.id}`"
              @click.stop="confirmDelete(fav)"
              title="Eliminar"
            >
              <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.2rem;">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 0-2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Sin resultados del filtro -->
      <div v-else class="empty-search">
        <svg class="empty-svg-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Ningún favorito coincide con "{{ searchQuery }}"</p>
        <button class="btn btn-ghost btn-sm" @click="searchQuery = ''">Ver todos</button>
      </div>
    </main>

    <!-- Estado vacío -->
    <div v-else class="empty-favorites">
      <div class="empty-fav-content">
        <span class="empty-icon">
          <svg class="empty-svg-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
        </span>
        <h2 class="empty-title">Sin favoritos aún</h2>
        <p class="empty-desc">
          Guarda las noticias que más te interesen presionando la estrella en cualquier noticia,
          o crea tus propias noticias aquí.
        </p>
        <div class="empty-actions">
          <router-link to="/" class="btn btn-primary" id="go-home-btn">
            <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke: white; margin-right: 0.25rem;">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
              <path d="M18 14h-8M18 18h-8M16 6H10v4h6V6Z"/>
            </svg>
            Ver noticias
          </router-link>
          <router-link to="/create" class="btn btn-secondary" id="go-create-btn">
            <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            Crear noticia
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <transition name="modal">
      <div v-if="deleteModal.show" class="modal-backdrop" id="delete-modal" @click.self="closeDeleteModal">
        <div class="modal-card">
          <div class="modal-icon">
            <svg class="modal-svg-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 0-2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>
          <h3 class="modal-title">¿Eliminar favorito?</h3>
          <p class="modal-desc">
            Se eliminará "<strong>{{ deleteModal.item?.title }}</strong>" de tus favoritos.
            Esta acción no se puede deshacer.
          </p>
          <div class="modal-actions">
            <button class="btn btn-secondary" id="cancel-delete-btn" @click="closeDeleteModal">
              Cancelar
            </button>
            <button
              class="btn btn-danger"
              id="confirm-delete-btn"
              @click="executeDelete"
              :disabled="deleting"
            >
              <svg v-if="deleting" class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;">
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              <svg v-else class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 0-2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast monocromático clásico -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" id="fav-toast">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchBar from '@/components/SearchBar.vue'
import Spinner from '@/components/Spinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  name: 'FavoritesView',

  components: { SearchBar, Spinner, ErrorMessage },

  data() {
    return {
      searchQuery: '',
      deleteModal: { show: true, item: null }, // Modal logic remains
      deleteModal: { show: false, item: null },
      deleting: false,
      toast: { show: false, message: '', type: 'success' },
      fallback: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
    }
  },

  computed: {
    ...mapState(['favorites', 'favoritesLoading', 'error']),

    filteredFavorites() {
      const q = this.searchQuery.toLowerCase().trim()
      if (!q) return this.favorites
      return this.favorites.filter(({ title = '', description = '' }) =>
        title.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      )
    }
  },

  mounted() {
    this.loadFavorites()
  },

  methods: {
    ...mapActions(['fetchFavorites', 'removeFavorite']),

    async loadFavorites() {
      await this.fetchFavorites()
    },

    truncate(text = '') {
      return text.length > 100 ? text.slice(0, 100) + '…' : text
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    },

    categoryLabel(cat) {
      const labels = {
        tecnologia: 'Tecnología', ciencia: 'Ciencia', deportes: 'Deportes',
        negocios: 'Negocios', salud: 'Salud', entretenimiento: 'Entretenimiento', general: 'General'
      }
      return labels[cat] || 'General'
    },

    openDetail(fav) {
      sessionStorage.setItem('currentArticle', JSON.stringify(fav))
      this.$router.push({ name: 'detail', params: { id: fav.id } })
    },

    openEdit(fav) {
      this.$router.push({ name: 'edit', params: { id: fav.id } })
    },

    confirmDelete(item) {
      this.deleteModal = { show: true, item }
    },

    closeDeleteModal() {
      this.deleteModal = { show: false, item: null }
    },

    async executeDelete() {
      if (!this.deleteModal.item) return
      this.deleting = true
      try {
        await this.removeFavorite(this.deleteModal.item.id)
        this.showToast('Favorito eliminado correctamente', 'info')
        this.closeDeleteModal()
      } catch {
        this.showToast('Error al eliminar el favorito', 'error')
      } finally {
        this.deleting = false
      }
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 3000)
    }
  }
}
</script>

<style scoped>
/* Header */
.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.4s ease;
}

.fav-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.header-svg-icon {
  color: var(--text);
}

.fav-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Search */
.fav-search-bar {
  margin-bottom: 2rem;
}

/* Fav card */
.fav-item {
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: fadeInUp 0.4s ease both;
}

.fav-card {
  background: var(--surface-1);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  flex: 1;
}

.fav-card:hover {
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.fav-card:hover .fav-card-title {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.fav-card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid var(--border-muted);
}

.fav-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.fav-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}

.fav-card-body {
  padding: 1.1rem;
}

.fav-card-meta {
  display: flex;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.fav-source {
  color: var(--text);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fav-dot { color: var(--text-muted); }

.fav-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fav-card-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Acciones CRUD */
.fav-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.6rem;
  background: var(--surface-2);
  border: 1px solid var(--border-muted);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.fav-actions .btn {
  flex: 1;
  justify-content: center;
}

.btn-svg-icon {
  stroke-width: 2px;
}

/* Empty search */
.empty-search {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.empty-svg-icon {
  stroke-width: 1.5px;
}

/* Empty state */
.empty-favorites {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
  animation: fadeInUp 0.4s ease;
}

.empty-fav-content {
  text-align: center;
  max-width: 480px;
}

.empty-icon { display: block; margin-bottom: 1.25rem; }
.empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-bottom: 0.75rem; }
.empty-desc { color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem; }

.empty-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.modal-icon { margin-bottom: 1rem; color: var(--text); }
.modal-svg-icon { stroke-width: 1.5px; }
.modal-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; margin-bottom: 0.75rem; }
.modal-desc { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.75rem; line-height: 1.6; }

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* Toast monocromático clásico */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  z-index: 9999;
  box-shadow: var(--shadow-md);
  background: #ffffff;
  color: var(--text);
}

.toast--error {
  color: #c53030;
  border-color: #c53030;
}

.toast-enter-active, .toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>

<template>
  <div class="page">
    <!-- Header -->
    <header class="fav-header">
      <div>
        <h1 class="fav-title">⭐ Mis Favoritos</h1>
        <p class="fav-subtitle">
          {{ favorites.length > 0
            ? `${favorites.length} noticia${favorites.length !== 1 ? 's' : ''} guardada${favorites.length !== 1 ? 's' : ''}`
            : 'Aún no tienes noticias guardadas' }}
        </p>
      </div>
      <router-link to="/create" class="btn btn-primary" id="fav-create-btn">
        ✏️ Nueva Noticia
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
              <div class="fav-card-overlay"></div>
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
              ✏️ Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              :id="`delete-fav-${fav.id}`"
              @click.stop="confirmDelete(fav)"
              title="Eliminar"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Sin resultados del filtro -->
      <div v-else class="empty-search">
        <span>🔍</span>
        <p>Ningún favorito coincide con "{{ searchQuery }}"</p>
        <button class="btn btn-ghost btn-sm" @click="searchQuery = ''">Ver todos</button>
      </div>
    </main>

    <!-- Estado vacío -->
    <div v-else class="empty-favorites">
      <div class="empty-fav-content">
        <span class="empty-icon">📭</span>
        <h2 class="empty-title">Sin favoritos aún</h2>
        <p class="empty-desc">
          Guarda las noticias que más te interesen presionando la estrella (☆) en cualquier noticia,
          o crea tus propias noticias aquí.
        </p>
        <div class="empty-actions">
          <router-link to="/" class="btn btn-primary" id="go-home-btn">
            📰 Ver noticias
          </router-link>
          <router-link to="/create" class="btn btn-secondary" id="go-create-btn">
            ✏️ Crear noticia
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <transition name="modal">
      <div v-if="deleteModal.show" class="modal-backdrop" id="delete-modal" @click.self="closeDeleteModal">
        <div class="modal-card">
          <div class="modal-icon">🗑️</div>
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
              {{ deleting ? '⏳ Eliminando...' : '🗑️ Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
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
  animation: fadeInUp 0.5s ease;
}

.fav-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 0.3rem;
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
  animation: fadeInUp 0.5s ease both;
}

.fav-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  flex: 1;
}

.fav-card:hover {
  border-color: rgba(124, 107, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.fav-card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.fav-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.fav-card:hover .fav-card-image img {
  transform: scale(1.05);
}

.fav-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(9,9,15,0.8) 0%, transparent 60%);
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
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.fav-source {
  color: var(--accent);
  font-weight: 600;
}

.fav-dot { color: var(--text-muted); }

.fav-card-title {
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
  padding: 0.75rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.fav-actions .btn {
  flex: 1;
  justify-content: center;
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
  font-size: 1rem;
}

.empty-search span { font-size: 2rem; }

/* Empty state */
.empty-favorites {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
  animation: fadeInUp 0.5s ease;
}

.empty-fav-content {
  text-align: center;
  max-width: 480px;
}

.empty-icon { font-size: 4rem; display: block; margin-bottom: 1.25rem; }
.empty-title { font-size: 1.6rem; margin-bottom: 0.75rem; }
.empty-desc { color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }

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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 1rem;
}

.modal-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.modal-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.modal-title { font-size: 1.3rem; margin-bottom: 0.75rem; }
.modal-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.75rem; line-height: 1.6; }

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.92); }

/* Toast */
.toast {
  position: fixed; bottom: 2rem; right: 2rem;
  padding: 0.85rem 1.5rem; border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9rem; z-index: 9999;
  box-shadow: var(--shadow-lg);
}
.toast--success { background: linear-gradient(135deg, #00d4a8, #00b894); color: white; }
.toast--info    { background: linear-gradient(135deg, var(--accent), #9580ff); color: white; }
.toast--error   { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>

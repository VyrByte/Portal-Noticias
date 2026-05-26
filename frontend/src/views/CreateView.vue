<template>
  <div class="page">
    <!-- Header -->
    <header class="create-header">
      <button class="btn btn-ghost back-btn" id="create-back-btn" @click="$router.back()">
        ← Volver
      </button>
      <div class="create-header-text">
        <h1 class="create-title">
          <svg class="header-svg-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          {{ isEditing ? 'Editar Noticia' : 'Nueva Noticia' }}
        </h1>
        <p class="create-subtitle">
          {{ isEditing
            ? 'Modifica los datos de tu noticia guardada'
            : 'Crea y guarda tu propia noticia en el portal' }}
        </p>
      </div>
    </header>

    <!-- Spinner de carga (modo edición) -->
    <Spinner
      v-if="loadingItem"
      message="Cargando noticia..."
      size="md"
      :full-screen="true"
    />

    <!-- Formulario -->
    <div v-else class="create-container">
      <div class="create-card">
        <!-- Indicador de pasos -->
        <div class="form-step-indicator">
          <div class="step-info">
            <span class="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </span>
            <div>
              <div class="step-title">{{ isEditing ? 'Editando favorito' : 'Creando nueva noticia' }}</div>
              <div class="step-desc">Los campos marcados con * son obligatorios</div>
            </div>
          </div>
        </div>

        <!-- Componente de formulario -->
        <NewsForm
          :initial-data="formInitialData"
          :is-submitting="submitting"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- Panel lateral de tips -->
      <aside class="create-tips">
        <div class="tips-card">
          <h3 class="tips-title">
            <svg class="tips-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A7 7 0 0 0 4 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
            </svg>
            Consejos
          </h3>
          <ul class="tips-list">
            <li v-for="(tip, i) in tips" :key="i" class="tip-item">
              <span class="tip-dot"></span>
              {{ tip }}
            </li>
          </ul>
        </div>

        <div class="tips-card tips-card--alt" v-if="isEditing">
          <h3 class="tips-title">
            <svg class="tips-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Información
          </h3>
          <div class="info-row" v-if="formInitialData">
            <span class="info-label">Creado</span>
            <span class="info-value">{{ formatDate(formInitialData.createdAt) }}</span>
          </div>
          <div class="info-row" v-if="formInitialData?.updatedAt">
            <span class="info-label">Actualizado</span>
            <span class="info-value">{{ formatDate(formInitialData.updatedAt) }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Toast monocromático clásico -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" id="create-toast">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NewsForm from '@/components/NewsForm.vue'
import Spinner from '@/components/Spinner.vue'
import { getFavoriteById } from '@/services/localApi.js'

export default {
  name: 'CreateView',

  components: { NewsForm, Spinner },

  data() {
    return {
      formInitialData: null,
      loadingItem: false,
      submitting: false,
      toast: { show: false, message: '', type: 'success' },
      tips: [
        'Un título descriptivo atrae más lectores',
        'La descripción debe resumir el contenido en 2-3 oraciones',
        'Usa una imagen de alta calidad (mínimo 800px de ancho)',
        'Selecciona la categoría más apropiada para mayor visibilidad',
        'Incluye la URL original para dar crédito a la fuente'
      ]
    }
  },

  computed: {
    ...mapState(['favorites']),

    isEditing() {
      return !!this.$route.params.id && this.$route.name === 'edit'
    }
  },

  async created() {
    if (this.isEditing) {
      await this.loadFavorite()
    }
  },

  methods: {
    ...mapActions(['addFavorite', 'editFavorite', 'fetchFavorites']),

    async loadFavorite() {
      this.loadingItem = true
      try {
        const { id } = this.$route.params
        const fromStore = this.favorites.find(f => String(f.id) === String(id))
        if (fromStore) {
          this.formInitialData = { ...fromStore }
        } else {
          this.formInitialData = await getFavoriteById(id)
        }
      } catch {
        this.showToast('No se pudo cargar la noticia', 'error')
        setTimeout(() => this.$router.push('/favorites'), 2000)
      } finally {
        this.loadingItem = false
      }
    },

    async handleSubmit(formData) {
      this.submitting = true
      try {
        if (this.isEditing) {
          const { id } = this.formInitialData
          await this.editFavorite({ id, ...formData })
          this.showToast('Noticia actualizada correctamente', 'success')
          setTimeout(() => this.$router.push('/favorites'), 1500)
        } else {
          await this.addFavorite({ ...formData })
          this.showToast('Noticia guardada en favoritos', 'success')
          setTimeout(() => this.$router.push('/favorites'), 1500)
        }
        await this.fetchFavorites()
      } catch {
        this.showToast('Error al guardar la noticia', 'error')
      } finally {
        this.submitting = false
      }
    },

    handleCancel() {
      this.$router.back()
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 4000)
    }
  }
}
</script>

<style scoped>
.create-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.4s ease;
}

.back-btn {
  flex-shrink: 0;
  margin-top: 0.3rem;
}

.create-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.35rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.header-svg-icon {
  stroke-width: 2.5px;
}

.create-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Layout */
.create-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: start;
  animation: fadeInUp 0.4s 0.1s ease both;
}

/* Card del formulario */
.create-card {
  background: var(--surface-1);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-sm);
  padding: 2rem;
}

/* Step indicator */
.form-step-indicator {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-muted);
}

.step-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-icon {
  font-size: 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-title {
  font-weight: 700;
  color: var(--text);
  font-size: 0.95rem;
}

.step-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

/* Tips sidebar */
.tips-card {
  background: var(--surface-1);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.tips-card--alt {
  background: var(--surface-2) !important;
  border-color: var(--border-muted) !important;
}

.tips-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.tips-svg-icon {
  stroke-width: 2px;
}

.tips-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  font-size: 0.82rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  line-height: 1.5;
}

.tip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text);
  flex-shrink: 0;
  margin-top: 0.4rem;
}

/* Info rows */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-muted);
}

.info-row:last-child { border-bottom: none; }

.info-label { color: var(--text-muted); }
.info-value { color: var(--text-secondary); font-weight: 600; }

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
  max-width: 380px;
}

.toast--error {
  color: #c53030;
  border-color: #c53030;
}

.toast-enter-active, .toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 900px) {
  .create-container {
    grid-template-columns: 1fr;
  }

  .create-tips {
    order: -1;
    display: none;
  }
}

@media (max-width: 600px) {
  .create-card { padding: 1.25rem; }
}
</style>

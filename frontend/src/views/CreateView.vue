<template>
  <div class="page">
    <!-- Header -->
    <header class="create-header">
      <button class="btn btn-ghost back-btn" id="create-back-btn" @click="$router.back()">
        ← Volver
      </button>
      <div class="create-header-text">
        <h1 class="create-title">
          {{ isEditing ? '✏️ Editar Noticia' : '📝 Nueva Noticia' }}
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
            <span class="step-icon">{{ isEditing ? '✏️' : '📝' }}</span>
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
          <h3 class="tips-title">💡 Consejos</h3>
          <ul class="tips-list">
            <li v-for="(tip, i) in tips" :key="i" class="tip-item">
              <span class="tip-dot"></span>
              {{ tip }}
            </li>
          </ul>
        </div>

        <div class="tips-card tips-card--alt" v-if="isEditing">
          <h3 class="tips-title">ℹ️ Información</h3>
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

    <!-- Toast -->
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
        // Primero busca en el store (más rápido)
        const fromStore = this.favorites.find(f => String(f.id) === String(id))
        if (fromStore) {
          this.formInitialData = { ...fromStore }
        } else {
          // Fallback: obtiene desde JSON Server
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
          // UPDATE: spread de datos existentes + nuevos datos del form
          const { id } = this.formInitialData
          await this.editFavorite({ id, ...formData })
          this.showToast('¡Noticia actualizada correctamente! ✅', 'success')
          setTimeout(() => this.$router.push('/favorites'), 1500)
        } else {
          // CREATE: agrega nuevo favorito
          await this.addFavorite({ ...formData })
          this.showToast('¡Noticia guardada en favoritos! ⭐', 'success')
          setTimeout(() => this.$router.push('/favorites'), 1500)
        }
        await this.fetchFavorites()
      } catch {
        this.showToast('Error al guardar la noticia. ¿Está corriendo el servidor?', 'error')
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
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.35rem;
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
  animation: fadeInUp 0.5s 0.1s ease both;
}

/* Card del formulario */
.create-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2rem;
}

/* Step indicator */
.form-step-indicator {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.step-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-icon {
  font-size: 2rem;
  background: rgba(124, 107, 255, 0.1);
  border: 1px solid rgba(124, 107, 255, 0.2);
  border-radius: var(--radius-md);
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-title {
  font-weight: 700;
  color: var(--text);
  font-size: 1rem;
}

.step-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

/* Tips sidebar */
.tips-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.tips-card--alt {
  background: rgba(124, 107, 255, 0.05);
  border-color: rgba(124, 107, 255, 0.15);
}

.tips-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
}

.tips-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  font-size: 0.85rem;
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
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 0.45rem;
}

/* Info rows */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.info-row:last-child { border-bottom: none; }

.info-label { color: var(--text-muted); }
.info-value { color: var(--text-secondary); font-weight: 500; }

/* Toast */
.toast {
  position: fixed; bottom: 2rem; right: 2rem;
  padding: 0.85rem 1.5rem; border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9rem; z-index: 9999;
  box-shadow: var(--shadow-lg); max-width: 380px;
}
.toast--success { background: linear-gradient(135deg, #00d4a8, #00b894); color: white; }
.toast--info    { background: linear-gradient(135deg, var(--accent), #9580ff); color: white; }
.toast--error   { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

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

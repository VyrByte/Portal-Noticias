<template>
  <div class="page">
    <div v-if="article">
      <!-- Back button -->
      <button class="btn btn-ghost back-btn" id="back-btn" @click="$router.back()">
        ← Volver
      </button>

      <!-- Hero de detalle -->
      <article class="detail-hero" aria-label="Detalle de noticia">
        <div class="detail-image-wrapper">
          <img
            :src="article.image || fallback"
            :alt="article.title"
            class="detail-image"
            @error="e => e.target.src = fallback"
          />
          <div class="detail-image-gradient"></div>

          <!-- Metadata sobre imagen -->
          <div class="detail-overlay-meta">
            <span :class="['badge', `badge-${article.category || 'general'}`]">
              {{ categoryLabel }}
            </span>
          </div>
        </div>

        <div class="detail-content">
          <!-- Meta -->
          <div class="detail-meta">
            <span class="detail-source">
              📰 {{ article.source?.name || article.source || 'Desconocido' }}
            </span>
            <span class="detail-dot">·</span>
            <time class="detail-time">{{ formattedDate }}</time>
            <span v-if="article.author" class="detail-dot">·</span>
            <span v-if="article.author" class="detail-author">✍️ {{ article.author }}</span>
          </div>

          <!-- Título -->
          <h1 class="detail-title">{{ article.title }}</h1>

          <!-- Descripción -->
          <p class="detail-description">{{ article.description }}</p>

          <!-- Divisor -->
          <div class="detail-divider"></div>

          <!-- Contenido -->
          <div class="detail-body">
            <p>{{ article.content || article.description }}</p>
          </div>

          <!-- Acciones -->
          <div class="detail-actions">
            <button
              class="btn"
              :class="isFav ? 'btn-secondary' : 'btn-primary'"
              id="detail-fav-btn"
              @click="toggleFavorite"
              :disabled="favLoading"
            >
              <span>{{ isFav ? '⭐ En favoritos' : '☆ Guardar en favoritos' }}</span>
            </button>

            <a
              v-if="article.url && article.url !== '#'"
              :href="article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost"
              id="detail-source-link"
            >
              🔗 Ver fuente original
            </a>
          </div>
        </div>
      </article>

      <!-- Artículos relacionados -->
      <section class="related-section" v-if="relatedArticles.length > 0">
        <h2 class="section-title">📎 Noticias relacionadas</h2>
        <div class="news-grid">
          <NewsCard
            v-for="(related, i) in relatedArticles"
            :key="related.id || i"
            :article="related"
            :index="i"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
      </section>
    </div>

    <!-- Sin artículo -->
    <ErrorMessage
      v-else
      icon="📭"
      title="Noticia no encontrada"
      message="No se pudo cargar el detalle de esta noticia."
      @retry="$router.push('/')"
    >
      <template #action>
        <button class="btn btn-primary" @click="$router.push('/')">Volver al inicio</button>
      </template>
    </ErrorMessage>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" id="detail-toast">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import NewsCard from '@/components/NewsCard.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  name: 'DetailView',

  components: { NewsCard, ErrorMessage },

  data() {
    return {
      article: null,
      favLoading: false,
      toast: { show: false, message: '', type: 'success' },
      fallback: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
    }
  },

  computed: {
    ...mapState(['news', 'favorites']),
    ...mapGetters(['isFavorite']),

    isFav() {
      return this.article ? this.isFavorite(this.article.title) : false
    },

    formattedDate() {
      if (!this.article?.publishedAt) return ''
      return new Date(this.article.publishedAt).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    },

    categoryLabel() {
      const labels = {
        tecnologia: 'Tecnología', ciencia: 'Ciencia', deportes: 'Deportes',
        negocios: 'Negocios', salud: 'Salud', entretenimiento: 'Entretenimiento', general: 'General'
      }
      return labels[this.article?.category] || 'General'
    },

    relatedArticles() {
      if (!this.article) return []
      // Filtra noticias de la misma categoría, excluye la actual
      return this.news
        .filter(({ id, category }) => id !== this.article.id && category === this.article.category)
        .slice(0, 3)
    }
  },

  created() {
    this.loadArticle()
  },

  methods: {
    ...mapActions(['addFavorite', 'removeFavorite', 'fetchFavorites']),

    loadArticle() {
      // Intenta cargar desde sessionStorage (guardado por NewsCard)
      const stored = sessionStorage.getItem('currentArticle')
      if (stored) {
        try {
          this.article = JSON.parse(stored)
          return
        } catch { /* continúa */ }
      }
      // Fallback: busca en el store por ID
      const { id } = this.$route.params
      this.article = this.news.find(a => String(a.id) === String(id)) || null
    },

    async toggleFavorite() {
      if (!this.article || this.favLoading) return
      this.favLoading = true
      try {
        if (this.isFav) {
          await this.fetchFavorites()
          const existing = this.favorites.find(f => f.title === this.article.title)
          if (existing) {
            await this.removeFavorite(existing.id)
            this.showToast('Quitado de favoritos', 'info')
          }
        } else {
          // Spread para normalizar la fuente
          await this.addFavorite({
            ...this.article,
            source: typeof this.article.source === 'object'
              ? this.article.source.name
              : this.article.source
          })
          this.showToast('¡Guardado en favoritos! ⭐', 'success')
        }
      } catch {
        this.showToast('Error al actualizar favoritos', 'error')
      } finally {
        this.favLoading = false
      }
    },

    async handleToggleFavorite(article) {
      try {
        if (this.isFavorite(article.title)) {
          await this.fetchFavorites()
          const existing = this.favorites.find(f => f.title === article.title)
          if (existing) await this.removeFavorite(existing.id)
        } else {
          await this.addFavorite({
            ...article,
            source: typeof article.source === 'object' ? article.source.name : article.source
          })
        }
      } catch (err) {
        console.error(err)
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
.back-btn {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.3s ease;
}

/* Hero de detalle */
.detail-hero {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: 3rem;
  animation: fadeInUp 0.5s ease;
}

.detail-image-wrapper {
  position: relative;
  height: 420px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--surface-1) 0%, rgba(9,9,15,0.3) 60%, transparent 100%);
}

.detail-overlay-meta {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

/* Content */
.detail-content {
  padding: 2rem 2.5rem 2.5rem;
}

.detail-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

.detail-source {
  color: var(--accent);
  font-weight: 600;
}

.detail-dot { color: var(--text-muted); }
.detail-time { color: var(--text-muted); }
.detail-author { color: var(--text-secondary); }

.detail-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.2;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.detail-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-style: italic;
}

.detail-divider {
  height: 1px;
  background: var(--border);
  margin: 2rem 0;
}

.detail-body {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 2rem;
}

.detail-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Related */
.related-section {
  animation: fadeInUp 0.5s 0.2s ease both;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

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

@media (max-width: 768px) {
  .detail-image-wrapper { height: 260px; }
  .detail-content { padding: 1.5rem; }
}
</style>

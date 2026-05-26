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
              <svg class="meta-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8M18 18h-8M16 6H10v4h6V6Z"/>
              </svg>
              {{ article.source?.name || article.source || 'Desconocido' }}
            </span>
            <span class="detail-dot">·</span>
            <time class="detail-time">{{ formattedDate }}</time>
            <span v-if="article.author" class="detail-dot">·</span>
            <span v-if="article.author" class="detail-author">
              <svg class="meta-svg-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
              {{ article.author }}
            </span>
          </div>

          <!-- Título -->
          <h1 class="detail-title">{{ article.title }}</h1>

          <!-- Descripción -->
          <p class="detail-description">{{ article.description }}</p>

          <!-- Divisor de Diario Tradicional (Doble Línea) -->
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
              <svg v-if="isFav" class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <svg v-else class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{{ isFav ? 'En favoritos' : 'Guardar en favoritos' }}</span>
            </button>

            <a
              v-if="article.url && article.url !== '#'"
              :href="article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost"
              id="detail-source-link"
            >
              <svg class="btn-svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Ver fuente original
            </a>
          </div>
        </div>
      </article>

      <!-- Artículos relacionados -->
      <section class="related-section" v-if="relatedArticles.length > 0">
        <h2 class="section-title">
          <svg class="title-svg-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
          Noticias relacionadas
        </h2>
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
      icon="empty"
      title="Noticia no encontrada"
      message="No se pudo cargar el detalle de esta noticia."
      @retry="$router.push('/')"
    >
      <template #action>
        <button class="btn btn-primary" @click="$router.push('/')">Volver al inicio</button>
      </template>
    </ErrorMessage>

    <!-- Toast monocromático clásico -->
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
      const stored = sessionStorage.getItem('currentArticle')
      if (stored) {
        try {
          this.article = JSON.parse(stored)
          return
        } catch { /* continúa */ }
      }
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
          await this.addFavorite({
            ...this.article,
            source: typeof this.article.source === 'object'
              ? this.article.source.name
              : this.article.source
          })
          this.showToast('Guardado en favoritos', 'success')
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
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 3rem;
  animation: fadeInUp 0.4s ease;
}

.detail-image-wrapper {
  position: relative;
  height: 420px;
  border-bottom: 1px solid var(--border-muted);
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-overlay-meta {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
}

/* Content */
.detail-content {
  padding: 2rem 2.5rem 2.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.detail-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.detail-source {
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.detail-dot { color: var(--text-muted); }
.detail-time { color: var(--text-muted); }

.detail-author {
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.meta-svg-icon {
  stroke-width: 2px;
  vertical-align: middle;
}

.detail-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.6rem, 5vw, 2.8rem);
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.detail-description {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-style: italic;
}

.detail-divider {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  height: 4px;
  background: transparent;
  margin: 2rem 0;
}

.detail-body {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.detail-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px dotted var(--border-muted);
}

.btn-svg-icon {
  margin-right: 0.25rem;
  stroke-width: 2px;
}

/* Related */
.related-section {
  animation: fadeInUp 0.4s 0.1s ease both;
  border-top: 1px solid var(--border);
  padding-top: 2rem;
  margin-top: 2rem;
}

.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.title-svg-icon {
  stroke-width: 2px;
}

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

@media (max-width: 768px) {
  .detail-image-wrapper { height: 260px; }
  .detail-content { padding: 1.5rem 1rem; }
}
</style>

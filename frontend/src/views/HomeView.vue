<template>
  <div class="page">
    <!-- Hero Header -->
    <header class="home-hero">
      <div class="hero-badge">📡 En vivo</div>
      <h1 class="hero-title">
        Las noticias que
        <span class="hero-title-accent">importan hoy</span>
      </h1>
      <p class="hero-subtitle">
        Mantente informado con las últimas noticias del mundo en tiempo real.
      </p>
    </header>

    <!-- Filtros de categoría -->
    <section class="home-filters" aria-label="Filtros de categoría">
      <CategoryFilter />
    </section>

    <!-- Estado de carga -->
    <Spinner
      v-if="loading"
      message="Cargando las últimas noticias..."
      size="lg"
      :full-screen="true"
    />

    <!-- Error -->
    <ErrorMessage
      v-else-if="error"
      title="Error al cargar noticias"
      :message="error"
      @retry="reload"
    />

    <!-- Contenido principal -->
    <main v-else>
      <!-- Indicador de fuente mock -->
      <div class="source-notice" v-if="news.length > 0">
        <span class="notice-dot"></span>
        <span>{{ news.length }} noticias cargadas · Categoría: <strong>{{ categoryLabel }}</strong></span>
      </div>

      <!-- Noticia destacada (primera) -->
      <section v-if="featuredArticle" class="featured-section" aria-label="Noticia destacada">
        <NewsCard
          :article="featuredArticle"
          :index="0"
          :featured="true"
          @toggle-favorite="handleToggleFavorite"
          class="featured-card"
        />
      </section>

      <!-- Grid de noticias -->
      <section class="news-section" aria-label="Lista de noticias">
        <h2 class="section-title">
          📰 Más noticias
          <span class="section-count">{{ restArticles.length }}</span>
        </h2>

        <div v-if="restArticles.length > 0" class="news-grid">
          <NewsCard
            v-for="(article, i) in restArticles"
            :key="article.id || i"
            :article="article"
            :index="i + 1"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <div v-else class="empty-state">
          <span>📭</span>
          <p>No hay más noticias en esta categoría.</p>
        </div>
      </section>
    </main>

    <!-- Toast de notificación -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" id="notification-toast">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import NewsCard from '@/components/NewsCard.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import Spinner from '@/components/Spinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  name: 'HomeView',

  components: { NewsCard, CategoryFilter, Spinner, ErrorMessage },

  data() {
    return {
      toast: { show: false, message: '', type: 'success' }
    }
  },

  computed: {
    ...mapState(['news', 'loading', 'error', 'selectedCategory']),
    ...mapGetters(['isFavorite']),

    // Desestructuración: separa el primer artículo del resto
    featuredArticle() {
      const [first] = this.news
      return first || null
    },

    restArticles() {
      const [, ...rest] = this.news
      return rest
    },

    categoryLabel() {
      const labels = {
        general: 'Todas',
        tecnologia: 'Tecnología',
        ciencia: 'Ciencia',
        deportes: 'Deportes',
        negocios: 'Negocios',
        salud: 'Salud',
        entretenimiento: 'Entretenimiento'
      }
      return labels[this.selectedCategory] || 'General'
    }
  },

  mounted() {
    // Solo carga si no hay noticias ya en el store
    if (this.news.length === 0) {
      this.fetchNews()
    }
    // Carga favoritos para el badge del navbar
    this.fetchFavorites()
  },

  methods: {
    ...mapActions(['fetchNews', 'fetchFavorites', 'addFavorite', 'removeFavorite']),

    reload() {
      this.fetchNews()
    },

    async handleToggleFavorite(article) {
      try {
        if (this.isFavorite(article.title)) {
          // Busca el favorito y lo elimina
          await this.$store.dispatch('fetchFavorites')
          const existing = this.$store.state.favorites.find(f => f.title === article.title)
          if (existing) {
            await this.removeFavorite(existing.id)
            this.showToast('Quitado de favoritos', 'info')
          }
        } else {
          // Spread para agregar campos extra
          await this.addFavorite({
            ...article,
            source: typeof article.source === 'object' ? article.source.name : article.source
          })
          this.showToast('¡Agregado a favoritos! ⭐', 'success')
        }
      } catch {
        this.showToast('Error al actualizar favoritos', 'error')
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
/* Hero */
.home-hero {
  text-align: center;
  padding: 3rem 0 2rem;
  animation: fadeInUp 0.6s ease;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(124, 107, 255, 0.15);
  border: 1px solid rgba(124, 107, 255, 0.3);
  color: var(--accent);
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--text);
  margin-bottom: 1rem;
  line-height: 1.15;
}

.hero-title-accent {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* Filtros */
.home-filters {
  margin: 1.5rem 0;
}

/* Notice */
.source-notice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.notice-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-3);
  animation: pulse 1.5s ease infinite;
}

/* Noticia destacada */
.featured-section {
  margin-bottom: 2.5rem;
}

.featured-card {
  max-width: 100%;
}

/* Sección de noticias */
.news-section {
  animation: fadeInUp 0.5s 0.2s ease both;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-count {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-state span {
  font-size: 2.5rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.85rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 9999;
  box-shadow: var(--shadow-lg);
}

.toast--success {
  background: linear-gradient(135deg, #00d4a8, #00b894);
  color: white;
}

.toast--info {
  background: linear-gradient(135deg, var(--accent), #9580ff);
  color: white;
}

.toast--error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>

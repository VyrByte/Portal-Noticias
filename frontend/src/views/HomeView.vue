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
    if (this.news.length === 0) {
      this.fetchNews()
    }
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
          await this.$store.dispatch('fetchFavorites')
          const existing = this.$store.state.favorites.find(f => f.title === article.title)
          if (existing) {
            await this.removeFavorite(existing.id)
            this.showToast('Quitado de favoritos', 'info')
          }
        } else {
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
  padding: 2.5rem 0 1.5rem;
  animation: fadeInUp 0.4s ease;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--text);
  margin-bottom: 0.75rem;
  line-height: 1.15;
}

.hero-title-accent {
  color: var(--text);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.hero-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

/* Filtros */
.home-filters {
  margin: 1rem 0;
}

/* Notice */
.source-notice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text);
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
  animation: fadeInUp 0.4s 0.1s ease both;
}

.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.section-count {
  background: var(--surface-2);
  border: 1px solid var(--border-muted);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-state span {
  font-size: 2.5rem;
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
</style>

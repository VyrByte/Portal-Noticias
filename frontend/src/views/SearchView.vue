<template>
  <div class="page">
    <!-- Header -->
    <header class="search-header">
      <h1 class="search-title">🔍 Buscar Noticias</h1>
      <p class="search-subtitle">Encuentra noticias por tema, palabra clave o categoría</p>
    </header>

    <!-- Barra de búsqueda grande -->
    <section class="search-section" aria-label="Búsqueda">
      <SearchBar
        v-model="query"
        placeholder="Busca por tecnología, ciencia, deportes..."
        @search="handleSearch"
      />

      <!-- Filtros rápidos de categoría -->
      <div class="quick-filters">
        <button
          v-for="tag in quickTags"
          :key="tag"
          :id="`quick-tag-${tag}`"
          class="quick-tag"
          :class="{ 'quick-tag--active': activeTag === tag }"
          @click="applyQuickTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- Estado: cargando -->
    <Spinner
      v-if="searching"
      message="Buscando noticias..."
      size="md"
    />

    <!-- Resultados de búsqueda -->
    <section v-else-if="query && results.length > 0" aria-label="Resultados de búsqueda">
      <div class="results-header">
        <span class="results-count">
          <strong>{{ results.length }}</strong> resultado{{ results.length !== 1 ? 's' : '' }}
          para "<em>{{ query }}</em>"
        </span>
        <button class="btn btn-ghost btn-sm" id="clear-search-btn" @click="clearSearch">
          Limpiar
        </button>
      </div>

      <div class="news-grid">
        <NewsCard
          v-for="(article, i) in results"
          :key="article.id || i"
          :article="article"
          :index="i"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>
    </section>

    <!-- Sin resultados -->
    <div v-else-if="query && results.length === 0 && !searching" class="no-results">
      <span class="no-results-icon">😕</span>
      <h3>Sin resultados para "{{ query }}"</h3>
      <p>Intenta con otras palabras clave o revisa la ortografía.</p>
      <div class="suggestions">
        <span class="suggestions-label">Prueba con:</span>
        <button
          v-for="sug in suggestions"
          :key="sug"
          class="quick-tag"
          @click="applyQuickTag(sug)"
        >
          {{ sug }}
        </button>
      </div>
    </div>

    <!-- Estado inicial: sin búsqueda -->
    <div v-else class="search-empty-state">
      <div class="search-categories-grid">
        <button
          v-for="cat in exploreCategories"
          :key="cat.value"
          :id="`explore-cat-${cat.value}`"
          class="explore-card"
          @click="applyQuickTag(cat.label)"
        >
          <span class="explore-emoji">{{ cat.emoji }}</span>
          <span class="explore-label">{{ cat.label }}</span>
        </button>
      </div>
      <p class="explore-hint">Selecciona un tema para explorar</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import SearchBar from '@/components/SearchBar.vue'
import NewsCard from '@/components/NewsCard.vue'
import Spinner from '@/components/Spinner.vue'
import { searchNewsFromAPI } from '@/services/newsApi.js'

export default {
  name: 'SearchView',

  components: { SearchBar, NewsCard, Spinner },

  data() {
    return {
      query: '',
      results: [],
      searching: false,
      activeTag: '',
      quickTags: ['Vue.js', 'Inteligencia Artificial', 'Ciencia', 'Deportes', 'México', 'Tecnología'],
      suggestions: ['Tecnología', 'Ciencia', 'Deportes', 'Salud'],
      exploreCategories: [
        { value: 'tecnologia',      emoji: '💻', label: 'Tecnología' },
        { value: 'ciencia',         emoji: '🔬', label: 'Ciencia' },
        { value: 'deportes',        emoji: '⚽', label: 'Deportes' },
        { value: 'negocios',        emoji: '💼', label: 'Negocios' },
        { value: 'salud',           emoji: '🏥', label: 'Salud' },
        { value: 'entretenimiento', emoji: '🎬', label: 'Entretenimiento' }
      ]
    }
  },

  computed: {
    ...mapState(['news']),
    ...mapGetters(['isFavorite'])
  },

  created() {
    // Si viene query desde la URL
    const { q } = this.$route.query
    if (q) {
      this.query = q
      this.handleSearch(q)
    }
  },

  methods: {
    ...mapActions(['searchNews', 'addFavorite', 'removeFavorite', 'fetchFavorites']),

    async handleSearch(searchQuery) {
      const q = searchQuery || this.query
      if (!q.trim()) {
        this.results = []
        this.activeTag = ''
        return
      }

      this.searching = true
      this.searchNews(q) // guarda en Vuex + LocalStorage

      try {
        // Primero busca en el store local (más rápido)
        const localResults = this.news.filter(({ title = '', description = '' }) =>
          title.toLowerCase().includes(q.toLowerCase()) ||
          description.toLowerCase().includes(q.toLowerCase())
        )

        if (localResults.length > 0) {
          this.results = localResults
        } else {
          // Si no hay resultados locales, consulta la API
          const { articles } = await searchNewsFromAPI(q)
          this.results = articles
        }
      } catch {
        this.results = []
      } finally {
        this.searching = false
      }
    },

    applyQuickTag(tag) {
      this.activeTag = this.activeTag === tag ? '' : tag
      this.query = this.activeTag
      if (this.activeTag) {
        this.handleSearch(this.activeTag)
      } else {
        this.results = []
      }
    },

    clearSearch() {
      this.query = ''
      this.results = []
      this.activeTag = ''
    },

    async handleToggleFavorite(article) {
      try {
        if (this.isFavorite(article.title)) {
          await this.fetchFavorites()
          const existing = this.$store.state.favorites.find(f => f.title === article.title)
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
    }
  }
}
</script>

<style scoped>
.search-header {
  text-align: center;
  padding: 2rem 0 1.5rem;
  animation: fadeInUp 0.5s ease;
}

.search-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
}

.search-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.5s 0.1s ease both;
}

/* Quick tags */
.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-tag {
  padding: 0.4rem 0.9rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all var(--transition);
}

.quick-tag:hover {
  background: var(--surface-3);
  color: var(--text);
}

.quick-tag--active {
  background: rgba(124, 107, 255, 0.15);
  border-color: var(--accent);
  color: var(--accent);
}

/* Results header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* No results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  animation: fadeInUp 0.4s ease;
}

.no-results-icon {
  font-size: 3rem;
}

.no-results h3 {
  font-size: 1.25rem;
  color: var(--text);
}

.no-results p {
  color: var(--text-muted);
}

.suggestions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.suggestions-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Explore state */
.search-empty-state {
  animation: fadeInUp 0.5s 0.2s ease both;
  text-align: center;
}

.search-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.explore-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all var(--transition);
  font-family: 'Inter', sans-serif;
}

.explore-card:hover {
  border-color: var(--accent);
  background: rgba(124, 107, 255, 0.08);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.explore-emoji {
  font-size: 2rem;
}

.explore-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.explore-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
}
</style>

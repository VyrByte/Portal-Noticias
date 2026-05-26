<template>
  <article
    class="news-card"
    :class="{ 'news-card--featured': featured }"
    @click="navigateToDetail"
    :id="`card-${article.id || index}`"
    role="button"
    tabindex="0"
    @keyup.enter="navigateToDetail"
  >
    <!-- Imagen -->
    <div class="card-image-wrapper">
      <img
        :src="article.image || fallbackImage"
        :alt="article.title"
        class="card-image"
        loading="lazy"
        @error="onImageError"
      />
      
      <!-- Badge de categoría sobre la imagen -->
      <span :class="['badge', `badge-${article.category || 'general'}`]" class="card-category">
        {{ categoryLabel }}
      </span>

      <!-- Botón favorito -->
      <button
        class="card-fav-btn"
        :class="{ 'card-fav-btn--active': isFav }"
        @click.stop="toggleFavorite"
        :id="`fav-btn-${article.id || index}`"
        :title="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        :aria-label="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
      >
        <svg v-if="isFav" class="fav-icon-svg" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <svg v-else class="fav-icon-svg" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    </div>

    <!-- Contenido -->
    <div class="card-body">
      <!-- Meta -->
      <div class="card-meta">
        <span class="card-source">{{ article.source?.name || article.source || 'Desconocido' }}</span>
        <span class="card-dot">·</span>
        <time class="card-time" :datetime="article.publishedAt">{{ timeAgo }}</time>
      </div>

      <!-- Título -->
      <h3 class="card-title">{{ article.title }}</h3>

      <!-- Descripción -->
      <p v-if="!featured" class="card-desc">{{ truncatedDescription }}</p>

      <!-- Footer -->
      <div class="card-footer">
        <span class="card-author" v-if="article.author">
          <svg class="author-icon-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          {{ article.author }}
        </span>
        <span class="card-read-more">Leer noticia →</span>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewsCard',

  props: {
    article: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },

  emits: ['toggle-favorite'],

  data() {
    return {
      fallbackImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
    }
  },

  computed: {
    ...mapGetters(['isFavorite']),

    isFav() {
      return this.isFavorite(this.article.title)
    },

    truncatedDescription() {
      const { description = '' } = this.article
      return description.length > 120 ? description.slice(0, 120) + '…' : description
    },

    timeAgo() {
      if (!this.article.publishedAt) return ''
      const diff = Date.now() - new Date(this.article.publishedAt).getTime()
      const minutes = Math.floor(diff / 60000)
      const hours   = Math.floor(diff / 3600000)
      const days    = Math.floor(diff / 86400000)

      if (minutes < 60) return `Hace ${minutes} min`
      if (hours < 24)   return `Hace ${hours}h`
      return `Hace ${days}d`
    },

    categoryLabel() {
      const labels = {
        tecnologia: 'Tecnología',
        ciencia: 'Ciencia',
        deportes: 'Deportes',
        negocios: 'Negocios',
        salud: 'Salud',
        entretenimiento: 'Entretenimiento',
        general: 'General'
      }
      return labels[this.article.category] || 'General'
    }
  },

  methods: {
    navigateToDetail() {
      sessionStorage.setItem('currentArticle', JSON.stringify(this.article))
      this.$router.push({
        name: 'detail',
        params: { id: this.article.id || this.index }
      })
    },

    async toggleFavorite() {
      this.$emit('toggle-favorite', this.article)
    },

    onImageError(e) {
      e.target.src = this.fallbackImage
    }
  }
}
</script>

<style scoped>
.news-card {
  background: var(--surface-1);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.4s ease forwards;
}

.news-card:hover {
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.news-card:hover .card-title {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.news-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Imagen */
.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid var(--border-muted);
}

.news-card--featured .card-image-wrapper {
  height: 300px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter var(--transition);
}

/* Categoría badge */
.card-category {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
}

/* Botón favorito */
.card-fav-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition);
  color: var(--text);
  padding: 0;
}

.card-fav-btn:hover {
  background: var(--surface-2);
  transform: scale(1.05);
}

.card-fav-btn--active {
  background: var(--border) !important;
  color: #ffffff !important;
}

.fav-icon-svg {
  stroke-width: 2px;
}

/* Body */
.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
}

.card-source {
  color: var(--text);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-dot {
  color: var(--text-muted);
}

.card-time {
  color: var(--text-muted);
}

.card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card--featured .card-title {
  font-size: 1.6rem;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.55;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px dotted var(--border-muted);
  margin-top: 0.5rem;
}

.card-author {
  font-size: 0.75rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.author-icon-svg {
  stroke-width: 2px;
}

.card-read-more {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}
</style>

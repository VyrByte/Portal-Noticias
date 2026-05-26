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
      <div class="card-image-overlay"></div>

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
        {{ isFav ? '⭐' : '☆' }}
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
          ✍️ {{ article.author }}
        </span>
        <span class="card-read-more">Leer más →</span>
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
      // Guarda el artículo en sessionStorage para que DetailView lo lea
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
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.5s ease forwards;
}

.news-card:hover {
  border-color: rgba(124, 107, 255, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124, 107, 255, 0.15);
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
}

.news-card--featured .card-image-wrapper {
  height: 280px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .card-image {
  transform: scale(1.06);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(9,9,15,0.8) 0%, transparent 50%);
}

/* Categoría badge */
.card-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

/* Botón favorito */
.card-fav-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(9, 9, 15, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all var(--transition);
}

.card-fav-btn:hover {
  background: rgba(124, 107, 255, 0.3);
  border-color: var(--accent);
  transform: scale(1.1);
}

.card-fav-btn--active {
  background: rgba(124, 107, 255, 0.2);
  border-color: var(--accent);
}

/* Body */
.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
}

.card-source {
  color: var(--accent);
  font-weight: 600;
}

.card-dot {
  color: var(--text-muted);
}

.card-time {
  color: var(--text-muted);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card--featured .card-title {
  font-size: 1.2rem;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.card-author {
  font-size: 0.78rem;
  color: var(--text-muted);
  truncate: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 60%;
}

.card-read-more {
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  flex-shrink: 0;
}

/* Delay de animación por índice */
.news-card:nth-child(1) { animation-delay: 0.05s; }
.news-card:nth-child(2) { animation-delay: 0.1s; }
.news-card:nth-child(3) { animation-delay: 0.15s; }
.news-card:nth-child(4) { animation-delay: 0.2s; }
.news-card:nth-child(5) { animation-delay: 0.25s; }
.news-card:nth-child(6) { animation-delay: 0.3s; }
</style>

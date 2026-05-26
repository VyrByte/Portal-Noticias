<template>
  <div class="category-filter" id="category-filter">
    <button
      v-for="cat in categories"
      :key="cat.value"
      :id="`cat-btn-${cat.value}`"
      class="cat-btn"
      :class="{ 'cat-btn--active': selectedCategory === cat.value }"
      @click="selectCategory(cat.value)"
    >
      <!-- Iconos vectoriales SVG dinámicos -->
      <svg v-if="cat.value === 'general'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>
      </svg>
      <svg v-if="cat.value === 'tecnologia'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
        <line x1="12" y1="17" x2="12" y2="20"/>
      </svg>
      <svg v-if="cat.value === 'ciencia'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 18h8"/>
        <path d="M3 22h18"/>
        <path d="M14 22a7 7 0 1 0-14 0"/>
        <path d="M9 14h6"/>
        <path d="M12 3v11"/>
        <circle cx="12" cy="3" r="1"/>
      </svg>
      <svg v-if="cat.value === 'deportes'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
        <path d="M12 2a6 6 0 0 1 6 6v1a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z"/>
      </svg>
      <svg v-if="cat.value === 'negocios'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
      <svg v-if="cat.value === 'salud'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
      <svg v-if="cat.value === 'entretenimiento'" class="cat-svg-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
        <path d="M2 12h20"/>
        <path d="M22 7H2"/>
        <path d="M2 17h20"/>
        <path d="M7 2v20"/>
        <path d="M17 2v20"/>
      </svg>
      <span class="cat-label">{{ cat.label }}</span>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CategoryFilter',

  data() {
    return {
      categories: [
        { value: 'general',         label: 'Todas' },
        { value: 'tecnologia',      label: 'Tecnología' },
        { value: 'ciencia',         label: 'Ciencia' },
        { value: 'deportes',        label: 'Deportes' },
        { value: 'negocios',        label: 'Negocios' },
        { value: 'salud',           label: 'Salud' },
        { value: 'entretenimiento', label: 'Entrete.' }
      ]
    }
  },

  computed: {
    ...mapState(['selectedCategory'])
  },

  methods: {
    ...mapActions(['changeCategory']),

    selectCategory(value) {
      this.changeCategory(value)
    }
  }
}
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: none;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  flex-shrink: 0;
}

.cat-btn:hover {
  background: var(--surface-2);
  color: var(--text);
}

.cat-btn--active {
  background: var(--text) !important;
  color: #ffffff !important;
  border-color: var(--text) !important;
}

.cat-svg-icon {
  flex-shrink: 0;
  stroke-width: 2px;
}
</style>

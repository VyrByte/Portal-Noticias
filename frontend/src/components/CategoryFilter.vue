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
      <span class="cat-emoji">{{ cat.emoji }}</span>
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
        { value: 'general',         emoji: '🌐', label: 'Todas' },
        { value: 'tecnologia',      emoji: '💻', label: 'Tecnología' },
        { value: 'ciencia',         emoji: '🔬', label: 'Ciencia' },
        { value: 'deportes',        emoji: '⚽', label: 'Deportes' },
        { value: 'negocios',        emoji: '💼', label: 'Negocios' },
        { value: 'salud',           emoji: '🏥', label: 'Salud' },
        { value: 'entretenimiento', emoji: '🎬', label: 'Entrete.' }
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

.cat-emoji {
  font-size: 0.95rem;
}
</style>

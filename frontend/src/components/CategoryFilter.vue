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
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  flex-shrink: 0;
}

.cat-btn:hover {
  background: var(--surface-3);
  color: var(--text);
  border-color: var(--border-hover);
}

.cat-btn--active {
  background: linear-gradient(135deg, var(--accent), #9580ff);
  border-color: var(--accent);
  color: white;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.cat-emoji {
  font-size: 1rem;
}
</style>

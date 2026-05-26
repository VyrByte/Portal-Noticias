<template>
  <div class="search-bar-wrapper">
    <div class="search-input-container" :class="{ focused: isFocused }">
      <span class="search-icon">🔍</span>
      <input
        v-model="localQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        id="main-search-input"
        autocomplete="off"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
        @keyup.escape="clearSearch"
        @input="handleInput"
      />
      <button
        v-if="localQuery"
        class="search-clear-btn"
        @click="clearSearch"
        id="search-clear-btn"
        aria-label="Limpiar búsqueda"
      >
        ✕
      </button>
    </div>

    <!-- Búsquedas recientes -->
    <transition name="dropdown">
      <div
        v-if="isFocused && recentSearches.length > 0 && !localQuery"
        class="search-dropdown"
        id="search-recent-dropdown"
      >
        <div class="dropdown-header">
          <span class="dropdown-title">🕐 Búsquedas recientes</span>
          <button class="dropdown-clear" @click="clearRecent" id="clear-recent-btn">
            Limpiar
          </button>
        </div>
        <ul class="recent-list">
          <li
            v-for="(term, i) in recentSearches"
            :key="i"
            class="recent-item"
            :id="`recent-item-${i}`"
            @mousedown.prevent="selectRecent(term)"
          >
            <span>↩</span>
            <span>{{ term }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SearchBar',

  props: {
    placeholder: {
      type: String,
      default: 'Buscar noticias...'
    },
    modelValue: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'search'],

  data() {
    return {
      localQuery: this.modelValue,
      isFocused: false,
      debounceTimer: null
    }
  },

  computed: {
    ...mapState(['recentSearches'])
  },

  watch: {
    modelValue(val) {
      this.localQuery = val
    }
  },

  methods: {
    ...mapMutations(['CLEAR_RECENT_SEARCHES']),

    handleInput() {
      this.$emit('update:modelValue', this.localQuery)
      // Debounce: espera 400ms antes de disparar búsqueda
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.$emit('search', this.localQuery)
      }, 400)
    },

    handleSearch() {
      clearTimeout(this.debounceTimer)
      this.$emit('search', this.localQuery)
      this.isFocused = false
    },

    clearSearch() {
      this.localQuery = ''
      this.$emit('update:modelValue', '')
      this.$emit('search', '')
    },

    handleBlur() {
      // Pequeño delay para permitir click en dropdown
      setTimeout(() => { this.isFocused = false }, 150)
    },

    selectRecent(term) {
      this.localQuery = term
      this.$emit('update:modelValue', term)
      this.$emit('search', term)
      this.isFocused = false
    },

    clearRecent() {
      this.CLEAR_RECENT_SEARCHES()
    }
  }
}
</script>

<style scoped>
.search-bar-wrapper {
  position: relative;
  width: 100%;
}

.search-input-container {
  display: flex;
  align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 0 1.25rem;
  gap: 0.75rem;
  transition: all var(--transition);
}

.search-input-container.focused {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--surface-3);
}

.search-icon {
  font-size: 1rem;
  flex-shrink: 0;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  padding: 0.85rem 0;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear-btn {
  background: var(--surface-3);
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
}

.search-clear-btn:hover {
  background: var(--accent);
  color: white;
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  z-index: 100;
  box-shadow: var(--shadow-lg);
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.dropdown-title {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-clear {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.78rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}

.dropdown-clear:hover {
  color: var(--accent-hover);
}

.recent-list {
  list-style: none;
  padding: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition);
}

.recent-item:hover {
  background: var(--surface-3);
  color: var(--text);
}

/* Transición dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

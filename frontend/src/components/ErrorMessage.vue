<template>
  <div class="error-wrapper" :id="id">
    <div class="error-icon">
      <!-- Vector SVG para estado vacío -->
      <svg v-if="icon === 'empty'" class="svg-icon-large" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
      <!-- Vector SVG para advertencia general -->
      <svg v-else class="svg-icon-large" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button
      v-if="showRetry"
      class="btn btn-primary"
      id="error-retry-btn"
      @click="$emit('retry')"
    >
      <svg class="svg-btn-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 4v6h-6"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
      Reintentar
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',

  props: {
    title: {
      type: String,
      default: 'Algo salió mal'
    },
    message: {
      type: String,
      default: 'Hubo un error al cargar los datos. Por favor intenta de nuevo.'
    },
    icon: {
      type: String,
      default: 'warning'
    },
    showRetry: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: 'error-message'
    }
  },

  emits: ['retry']
}
</script>

<style scoped>
.error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.error-icon {
  animation: fadeInUp 0.4s ease;
  color: var(--text);
}

.svg-icon-large {
  stroke-width: 1.5;
}

.svg-btn-icon {
  margin-right: 0.25rem;
}

.error-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  color: var(--text);
  animation: fadeInUp 0.4s 0.1s ease both;
}

.error-message {
  color: var(--text-secondary);
  max-width: 400px;
  font-size: 0.95rem;
  animation: fadeInUp 0.4s 0.2s ease both;
}

.btn {
  animation: fadeInUp 0.4s 0.3s ease both;
}
</style>

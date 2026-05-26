<template>
  <div class="error-wrapper" :id="id">
    <div class="error-icon">{{ icon }}</div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button
      v-if="showRetry"
      class="btn btn-primary"
      id="error-retry-btn"
      @click="$emit('retry')"
    >
      🔄 Reintentar
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
      default: '⚠️'
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
  font-size: 3.5rem;
  animation: fadeInUp 0.4s ease;
}

.error-title {
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

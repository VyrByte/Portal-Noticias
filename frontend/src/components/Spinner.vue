<template>
  <div class="spinner-wrapper" :class="wrapperClass" :id="id">
    <div class="spinner" :class="`spinner--${size}`">
      <div class="spinner-ring"></div>
      <div class="spinner-ring spinner-ring--2"></div>
    </div>
    <p v-if="message" class="spinner-message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Spinner',

  props: {
    message: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['sm', 'md', 'lg'].includes(val)
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'loading-spinner'
    }
  },

  computed: {
    wrapperClass() {
      return this.fullScreen ? 'spinner-wrapper--fullscreen' : ''
    }
  }
}
</script>

<style scoped>
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner-wrapper--fullscreen {
  min-height: 60vh;
}

.spinner {
  position: relative;
}

.spinner--sm { width: 32px; height: 32px; }
.spinner--md { width: 48px; height: 48px; }
.spinner--lg { width: 64px; height: 64px; }

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--text);
  animation: spin 1s linear infinite;
}

.spinner-ring--2 {
  inset: 6px;
  border-top-color: var(--text-muted);
  animation-duration: 0.7s;
  animation-direction: reverse;
  animation-name: spin;
}

.spinner-message {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
  animation: pulse 1.5s ease infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

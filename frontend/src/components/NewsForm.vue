<template>
  <form class="news-form" @submit.prevent="handleSubmit" novalidate id="news-form">
    <div class="form-grid">
      <!-- Título -->
      <div class="form-group form-full">
        <label class="form-label" for="field-title">Título *</label>
        <input
          v-model="form.title"
          type="text"
          id="field-title"
          class="form-input"
          :class="{ error: errors.title }"
          placeholder="Ej: Nueva tecnología revoluciona el mercado"
          @blur="validateField('title')"
        />
        <span v-if="errors.title" class="form-error" id="error-title">
          ⚠ {{ errors.title }}
        </span>
      </div>

      <!-- Descripción -->
      <div class="form-group form-full">
        <label class="form-label" for="field-description">Descripción *</label>
        <textarea
          v-model="form.description"
          id="field-description"
          class="form-textarea"
          :class="{ error: errors.description }"
          placeholder="Escribe una descripción breve de la noticia..."
          rows="3"
          @blur="validateField('description')"
        ></textarea>
        <div class="form-footer-row">
          <span v-if="errors.description" class="form-error" id="error-description">
            ⚠ {{ errors.description }}
          </span>
          <span class="char-count" :class="{ 'char-count--warn': form.description.length > 280 }">
            {{ form.description.length }}/300
          </span>
        </div>
      </div>

      <!-- Contenido -->
      <div class="form-group form-full">
        <label class="form-label" for="field-content">Contenido completo</label>
        <textarea
          v-model="form.content"
          id="field-content"
          class="form-textarea"
          placeholder="Escribe el contenido completo de la noticia..."
          rows="5"
        ></textarea>
      </div>

      <!-- Categoría -->
      <div class="form-group">
        <label class="form-label" for="field-category">Categoría *</label>
        <select
          v-model="form.category"
          id="field-category"
          class="form-select"
          :class="{ error: errors.category }"
          @change="validateField('category')"
        >
          <option value="">— Selecciona una categoría —</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
        <span v-if="errors.category" class="form-error" id="error-category">
          ⚠ {{ errors.category }}
        </span>
      </div>

      <!-- Autor -->
      <div class="form-group">
        <label class="form-label" for="field-author">Autor</label>
        <input
          v-model="form.author"
          type="text"
          id="field-author"
          class="form-input"
          placeholder="Nombre del autor"
        />
      </div>

      <!-- URL de imagen -->
      <div class="form-group form-full">
        <label class="form-label" for="field-image">URL de imagen</label>
        <input
          v-model="form.image"
          type="url"
          id="field-image"
          class="form-input"
          :class="{ error: errors.image }"
          placeholder="https://ejemplo.com/imagen.jpg"
          @blur="validateField('image')"
        />
        <span v-if="errors.image" class="form-error" id="error-image">
          ⚠ {{ errors.image }}
        </span>
      </div>

      <!-- Preview de imagen -->
      <div v-if="validImageUrl" class="form-group form-full">
        <label class="form-label">Vista previa de imagen</label>
        <div class="image-preview">
          <img
            :src="form.image"
            alt="Vista previa"
            class="preview-img"
            @error="imagePreviewError = true"
          />
        </div>
      </div>

      <!-- URL de la noticia -->
      <div class="form-group form-full">
        <label class="form-label" for="field-url">URL de la noticia original</label>
        <input
          v-model="form.url"
          type="url"
          id="field-url"
          class="form-input"
          placeholder="https://fuente-original.com/noticia"
        />
      </div>

      <!-- Fuente -->
      <div class="form-group">
        <label class="form-label" for="field-source">Fuente / Medio</label>
        <input
          v-model="form.source"
          type="text"
          id="field-source"
          class="form-input"
          placeholder="Ej: El Universal, CNN, BBC"
        />
      </div>
    </div>

    <!-- Acciones del formulario -->
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        id="form-cancel-btn"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        id="form-submit-btn"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">⏳ Guardando...</span>
        <span v-else>{{ isEditing ? '✏️ Actualizar' : '✅ Guardar Noticia' }}</span>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewsForm',

  props: {
    initialData: {
      type: Object,
      default: null
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },

  emits: ['submit', 'cancel'],

  data() {
    // Desestructuración para inicializar el formulario con datos existentes
    const { title = '', description = '', content = '', category = '',
      author = '', image = '', url = '', source = '' } = this.initialData || {}

    return {
      form: { title, description, content, category, author, image, url, source },
      errors: {},
      imagePreviewError: false,
      categories: [
        { value: 'tecnologia',      label: '💻 Tecnología' },
        { value: 'ciencia',         label: '🔬 Ciencia' },
        { value: 'deportes',        label: '⚽ Deportes' },
        { value: 'negocios',        label: '💼 Negocios' },
        { value: 'salud',           label: '🏥 Salud' },
        { value: 'entretenimiento', label: '🎬 Entretenimiento' },
        { value: 'general',         label: '📰 General' }
      ]
    }
  },

  computed: {
    isEditing() {
      return !!this.initialData?.id
    },

    validImageUrl() {
      const { image } = this.form
      if (!image || this.imagePreviewError) return false
      try {
        new URL(image)
        return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(image) ||
               image.includes('unsplash') ||
               image.includes('images.')
      } catch {
        return false
      }
    }
  },

  watch: {
    'form.image'() {
      this.imagePreviewError = false
    }
  },

  methods: {
    validateField(field) {
      const { form } = this
      // Spread para copiar errores actuales
      const errs = { ...this.errors }
      delete errs[field]

      switch (field) {
        case 'title':
          if (!form.title.trim())
            errs.title = 'El título es obligatorio'
          else if (form.title.trim().length < 5)
            errs.title = 'El título debe tener al menos 5 caracteres'
          break

        case 'description':
          if (!form.description.trim())
            errs.description = 'La descripción es obligatoria'
          else if (form.description.trim().length < 20)
            errs.description = 'La descripción debe tener al menos 20 caracteres'
          else if (form.description.length > 300)
            errs.description = 'La descripción no puede superar 300 caracteres'
          break

        case 'category':
          if (!form.category)
            errs.category = 'Debes seleccionar una categoría'
          break

        case 'image':
          if (form.image) {
            try {
              new URL(form.image)
            } catch {
              errs.image = 'La URL de la imagen no es válida'
            }
          }
          break
      }

      this.errors = errs
    },

    validateAll() {
      const fields = ['title', 'description', 'category', 'image']
      fields.forEach(field => this.validateField(field))
      return Object.keys(this.errors).length === 0
    },

    handleSubmit() {
      if (!this.validateAll()) return

      // Rest: extrae todos los campos del form
      const { ...formData } = this.form
      this.$emit('submit', {
        ...formData,
        publishedAt: new Date().toISOString(),
        image: formData.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
      })
    }
  }
}
</script>

<style scoped>
.news-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-full {
  grid-column: 1 / -1;
}

.form-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 1.2rem;
}

.char-count {
  font-size: 0.78rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.char-count--warn {
  color: #ff6b4a;
}

/* Image preview */
.image-preview {
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 200px;
  border: 1px solid var(--border);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Acciones */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

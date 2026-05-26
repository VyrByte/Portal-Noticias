<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo" id="nav-logo">
        <span class="logo-icon">📰</span>
        <span class="logo-text">EL PORTAL DE NOTICIAS</span>
      </router-link>

      <!-- Links de navegación (desktop) -->
      <ul class="navbar-links" v-if="!isMobileMenuOpen || !isMobile">
        <li v-for="link in navLinks" :key="link.name">
          <router-link
            :to="link.path"
            :id="`nav-${link.name}`"
            class="nav-link"
            active-class="nav-link--active"
            exact-active-class="nav-link--exact"
          >
            <span class="nav-icon">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
            <!-- Badge de favoritos -->
            <span
              v-if="link.name === 'favorites' && totalFavorites > 0"
              class="nav-badge"
            >
              {{ totalFavorites }}
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Acciones (búsqueda + crear) -->
      <div class="navbar-actions">
        <router-link to="/search" class="btn btn-ghost btn-sm nav-search-btn" id="nav-search-btn">
          🔍 Buscar
        </router-link>
        <router-link to="/create" class="btn btn-primary btn-sm" id="nav-create-btn">
          ✏️ Crear
        </router-link>
        <!-- Botón menú móvil -->
        <button
          class="hamburger"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Abrir menú"
          id="nav-hamburger"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="mobile-menu" id="mobile-menu">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          :id="`nav-mobile-${link.name}`"
          class="mobile-nav-link"
          active-class="mobile-nav-link--active"
          @click="closeMobileMenu"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.label }}</span>
          <span v-if="link.name === 'favorites' && totalFavorites > 0" class="nav-badge">
            {{ totalFavorites }}
          </span>
        </router-link>
        <router-link to="/search" class="mobile-nav-link" @click="closeMobileMenu">
          🔍 Buscar
        </router-link>
        <router-link to="/create" class="mobile-nav-link mobile-nav-create" @click="closeMobileMenu">
          ✏️ Nueva Noticia
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',

  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false,
      isMobile: false,
      navLinks: [
        { name: 'home',      path: '/',          icon: '🏠', label: 'Inicio' },
        { name: 'favorites', path: '/favorites', icon: '⭐', label: 'Favoritos' }
      ]
    }
  },

  computed: {
    ...mapGetters(['totalFavorites'])
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.checkMobile)
  },

  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 20
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) this.isMobileMenuOpen = false
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-muted);
  transition: all 0.25s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  border-bottom-color: var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.4rem;
}

.logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 0.02em;
}

/* Nav links */
.navbar-links {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all var(--transition);
  position: relative;
}

.nav-link:hover {
  color: var(--text);
  background: var(--surface-2);
}

.nav-link--active,
.nav-link--exact {
  color: var(--text) !important;
  background: transparent;
  text-decoration: underline !important;
  text-decoration-thickness: 2px !important;
  text-underline-offset: 4px !important;
}

.nav-badge {
  background: var(--text);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-sm);
  min-width: 18px;
  text-align: center;
}

/* Acciones */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.nav-search-btn {
  color: var(--text-secondary);
}

/* Hamburguesa */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 1px solid var(--border-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 0;
  transition: all var(--transition);
}

/* Menú móvil */
.mobile-menu {
  border-top: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.98);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all var(--transition);
}

.mobile-nav-link:hover,
.mobile-nav-link--active {
  color: var(--text);
  background: var(--surface-2);
}

.mobile-nav-create {
  background: var(--accent) !important;
  color: white !important;
  justify-content: center;
  font-weight: 700;
  margin-top: 0.5rem;
  border-radius: var(--radius-sm);
}

/* Transiciones menú móvil */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .nav-search-btn {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}
</style>

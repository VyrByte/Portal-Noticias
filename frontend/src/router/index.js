import { createRouter, createWebHistory } from 'vue-router'

// Importación lazy de vistas para mejor rendimiento
const HomeView      = () => import('@/views/HomeView.vue')
const DetailView    = () => import('@/views/DetailView.vue')
const SearchView    = () => import('@/views/SearchView.vue')
const FavoritesView = () => import('@/views/FavoritesView.vue')
const CreateView    = () => import('@/views/CreateView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio — Noticias Wicho' }
  },
  {
    path: '/news/:id',
    name: 'detail',
    component: DetailView,
    meta: { title: 'Detalle — Noticias Wicho' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: 'Buscar — Noticias Wicho' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { title: 'Favoritos — Noticias Wicho' }
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView,
    meta: { title: 'Crear Noticia — Noticias Wicho' }
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: CreateView,
    meta: { title: 'Editar Noticia — Noticias Wicho' }
  },
  {
    // Redirige cualquier ruta desconocida al inicio
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// Guard de navegación: actualiza el título del documento
router.afterEach((to) => {
  const { title } = to.meta
  if (title) document.title = title
})

export default router

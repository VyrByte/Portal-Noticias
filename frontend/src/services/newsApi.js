// =============================================
// Servicio para GNews API (API Externa Real)
// Incluye mock data de respaldo
// =============================================

const GNEWS_API_KEY = 'bb4c4b3f3e9e6a0f8d2c1b5e7a9f0d3c' // Reemplazar con key real
const GNEWS_BASE_URL = 'https://gnews.io/api/v4'

// Categorías disponibles en GNews
const VALID_CATEGORIES = [
  'general', 'world', 'nation', 'business',
  'technology', 'entertainment', 'sports', 'science', 'health'
]

// Mapeo de categorías en español a GNews
const CATEGORY_MAP = {
  general: 'general',
  tecnologia: 'technology',
  ciencia: 'science',
  deportes: 'sports',
  negocios: 'business',
  salud: 'health',
  entretenimiento: 'entertainment'
}

// ── Mock data de respaldo ──────────────────────
const MOCK_ARTICLES = [
  {
    id: 'mock-1',
    title: 'Vue.js 3.5 trae nuevas mejoras de rendimiento y Composition API mejorada',
    description: 'El equipo de Vue.js anunció la versión 3.5 con mejoras significativas en el rendimiento, incluyendo un sistema de reactividad reescrito que es hasta un 56% más rápido.',
    content: 'Vue.js continúa siendo uno de los frameworks más elegantes del ecosistema JavaScript. La nueva versión 3.5 trae consigo mejoras sustanciales en el sistema de reactividad, compilador optimizado y mejor soporte para TypeScript.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    source: { name: 'TechCrunch' },
    category: 'tecnologia',
    url: 'https://vuejs.org',
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    author: 'Evan You'
  },
  {
    id: 'mock-2',
    title: 'NASA descubre nuevas señales de agua en la superficie de Marte',
    description: 'El rover Perseverance ha detectado indicios de agua líquida subterránea en la región de Jezero, lo que podría cambiar nuestra comprensión de la habitabilidad marciana.',
    content: 'En un hallazgo revolucionario, los científicos de la NASA han confirmado la presencia de agua líquida a profundidades de entre 10 y 20 metros bajo la superficie de Marte. Este descubrimiento abre nuevas posibilidades para la búsqueda de vida microbiana.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
    source: { name: 'NASA News' },
    category: 'ciencia',
    url: 'https://nasa.gov',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: 'Dr. Sarah Chen'
  },
  {
    id: 'mock-3',
    title: 'La IA generativa revoluciona el desarrollo de software en 2026',
    description: 'Los modelos de lenguaje de última generación han reducido el tiempo de desarrollo de software en un 40%, según un nuevo estudio de la Universidad de Stanford.',
    content: 'La inteligencia artificial generativa ha transformado por completo la industria del desarrollo de software. Desde la autocompletación de código hasta la generación automática de tests, las herramientas de IA se han convertido en compañeras inseparables de los desarrolladores modernos.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    source: { name: 'MIT Technology Review' },
    category: 'tecnologia',
    url: 'https://technologyreview.com',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    author: 'Prof. James Liu'
  },
  {
    id: 'mock-4',
    title: 'Copa Mundial 2026: México avanza a cuartos de final con victoria histórica',
    description: 'La selección mexicana venció 3-1 a Argentina en un partido lleno de emociones en el Estadio Azteca, clasificando a cuartos de final de la Copa Mundial.',
    content: 'En un partido que quedará grabado en la historia del fútbol mexicano, el Tri dominó durante los 90 minutos con un juego técnico y veloz que dejó sin respuesta a la vigente campeona del mundo.',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
    source: { name: 'ESPN México' },
    category: 'deportes',
    url: 'https://espn.com',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    author: 'Carlos Rodríguez'
  },
  {
    id: 'mock-5',
    title: 'Bitcoin supera los $120,000 dólares por primera vez en la historia',
    description: 'La criptomoneda más popular del mundo alcanzó un nuevo máximo histórico impulsado por la adopción institucional masiva y la aprobación de ETFs en múltiples países.',
    content: 'El mercado de criptomonedas está experimentando uno de sus momentos más álgidos. Bitcoin, la criptomoneda pionera, ha roto todos los récords previos al superar la barrera psicológica de los 120,000 dólares.',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
    source: { name: 'CoinDesk' },
    category: 'negocios',
    url: 'https://coindesk.com',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    author: 'Michael Torres'
  },
  {
    id: 'mock-6',
    title: 'Nuevo tratamiento con nanobots elimina tumores cancerígenos en ensayos clínicos',
    description: 'Investigadores del MIT han desarrollado nanobots que pueden identificar y destruir células cancerígenas con una precisión del 99.7%, sin dañar tejidos sanos.',
    content: 'La medicina del futuro está aquí. Un equipo de investigadores del Instituto Tecnológico de Massachusetts ha logrado un avance sin precedentes en el tratamiento del cáncer utilizando nanobots programables que navegan por el torrente sanguíneo.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    source: { name: 'Nature Medicine' },
    category: 'salud',
    url: 'https://nature.com',
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    author: 'Dr. Elena Martínez'
  },
  {
    id: 'mock-7',
    title: 'SpaceX lanza misión tripulada a la Luna: primer alunizaje en 54 años',
    description: 'La nave Starship de SpaceX despegó exitosamente con cuatro astronautas rumbo a la Luna, en lo que será el primer alunizaje humano desde la misión Apollo 17 en 1972.',
    content: 'Un nuevo capítulo en la exploración espacial ha comenzado. La nave Starship de SpaceX, la más grande jamás construida por la humanidad, ha partido rumbo a la Luna con cuatro valientes astronautas a bordo.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80',
    source: { name: 'Space.com' },
    category: 'ciencia',
    url: 'https://space.com',
    publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    author: 'Amanda Foster'
  },
  {
    id: 'mock-8',
    title: 'Apple presenta el iPhone 18 con chip cuántico y batería de semana completa',
    description: 'Apple ha presentado su iPhone más revolucionario hasta la fecha, equipado con un procesador cuántico de 3nm y una batería que dura toda una semana con uso intensivo.',
    content: 'El nuevo iPhone 18 redefine lo que esperamos de un smartphone. Con su innovador chip cuántico A20, procesamiento de imágenes en tiempo real con IA y una pantalla micro-LED de 6.3 pulgadas, Apple vuelve a marcar el estándar de la industria.',
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
    source: { name: 'The Verge' },
    category: 'tecnologia',
    url: 'https://theverge.com',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    author: 'Jessica Park'
  },
  {
    id: 'mock-9',
    title: 'Videojuego indie mexicano "Leyendas del Anáhuac" arrasa en Steam',
    description: 'Un equipo de desarrolladores mexicanos creó un RPG basado en la mitología azteca que superó 500,000 ventas en su primera semana, convirtiéndose en un fenómeno global.',
    content: 'El éxito del juego indie "Leyendas del Anáhuac" demuestra el talento y creatividad de los desarrolladores latinoamericanos. El juego, creado por solo 8 personas en Guadalajara, ha conquistado corazones en todo el mundo con su rica narrativa y arte visual impresionante.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    source: { name: 'IGN Latino' },
    category: 'entretenimiento',
    url: 'https://ign.com',
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    author: 'Diego Ramírez'
  },
  {
    id: 'mock-10',
    title: 'Temperatura global alcanza récord histórico: urgencia climática sin precedentes',
    description: 'El mes de mayo de 2026 registró la temperatura global más alta en la historia instrumental, con 1.8°C por encima del promedio preindustrial, alarmando a científicos.',
    content: 'Los datos del Sistema de Monitoreo Climático Global confirman que mayo de 2026 ha sido el mes más caluroso registrado en más de 170 años de mediciones instrumentales. Los expertos urgen a los gobiernos a acelerar la transición energética.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    source: { name: 'BBC Science' },
    category: 'ciencia',
    url: 'https://bbc.com',
    publishedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    author: 'Sophie Williams'
  },
  {
    id: 'mock-11',
    title: 'Neymar anuncia su retiro del fútbol profesional a los 34 años',
    description: 'La estrella brasileña comunicó su decisión de retirarse del fútbol activo, dejando un legado de goles y habilidad que marcó una era en el deporte rey.',
    content: 'Neymar da Silva Santos Jr., conocido simplemente como Neymar, ha anunciado su retiro del fútbol profesional. El delantero brasileño, de 34 años, comunicó su decisión en una emotiva rueda de prensa en São Paulo rodeado de su familia y amigos.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    source: { name: 'Marca' },
    category: 'deportes',
    url: 'https://marca.com',
    publishedAt: new Date(Date.now() - 11 * 3600000).toISOString(),
    author: 'Roberto Gómez'
  },
  {
    id: 'mock-12',
    title: 'Netflix estrena la serie más cara de su historia: "Cosmos: Renacimiento"',
    description: 'Con un presupuesto de 800 millones de dólares, Netflix lanza una épica serie de ciencia ficción que redefine los límites de la producción audiovisual.',
    content: '"Cosmos: Renacimiento" llega a Netflix con una producción que supera todos los récords de la industria. Con efectos visuales generados por IA y filmada parcialmente en el espacio exterior, esta serie de 12 episodios promete ser el evento televisivo de la década.',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    source: { name: 'Variety' },
    category: 'entretenimiento',
    url: 'https://variety.com',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    author: 'Laura Méndez'
  }
]

// ── Función principal de fetch ─────────────────
export const fetchNewsFromAPI = async ({ category = 'general', page = 1, query = '' } = {}) => {
  // Primero intentamos con la API real, si falla usamos mock data
  try {
    const gnewsCategory = CATEGORY_MAP[category] || 'general'
    const params = new URLSearchParams({
      token: GNEWS_API_KEY,
      lang: 'es',
      country: 'mx',
      max: 10,
      page,
      ...(query ? { q: query } : { topic: gnewsCategory })
    })

    const response = await fetch(`${GNEWS_BASE_URL}/top-headlines?${params}`)

    if (!response.ok) throw new Error('API no disponible')

    const data = await response.json()

    if (!data.articles || data.articles.length === 0) throw new Error('Sin artículos')

    // Normaliza los artículos de GNews al formato interno
    const articles = data.articles.map((article, index) => ({
      id: `gnews-${index}-${Date.now()}`,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      source: { name: article.source?.name || 'Desconocido' },
      category,
      url: article.url,
      publishedAt: article.publishedAt,
      author: article.source?.name || 'Redacción'
    }))

    return { articles, totalArticles: data.totalArticles || articles.length }

  } catch (_error) {
    // Fallback a mock data — filtra por categoría si no es 'general'
    const filtered = category === 'general'
      ? MOCK_ARTICLES
      : MOCK_ARTICLES.filter(a => a.category === category)

    const articlesToReturn = filtered.length > 0 ? filtered : MOCK_ARTICLES

    return {
      articles: articlesToReturn,
      totalArticles: articlesToReturn.length
    }
  }
}

// Búsqueda de noticias por query
export const searchNewsFromAPI = async (query) => {
  try {
    const params = new URLSearchParams({
      token: GNEWS_API_KEY,
      q: query,
      lang: 'es',
      max: 10
    })

    const response = await fetch(`${GNEWS_BASE_URL}/search?${params}`)
    if (!response.ok) throw new Error('API no disponible')

    const data = await response.json()
    const articles = data.articles.map((article, index) => ({
      id: `search-${index}-${Date.now()}`,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      source: { name: article.source?.name },
      category: 'general',
      url: article.url,
      publishedAt: article.publishedAt,
      author: article.source?.name || 'Redacción'
    }))

    return { articles, totalArticles: data.totalArticles }

  } catch (_error) {
    // Fallback a mock: filtra por texto
    const q = query.toLowerCase()
    const filtered = MOCK_ARTICLES.filter(({ title, description }) =>
      title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
    )
    return { articles: filtered, totalArticles: filtered.length }
  }
}

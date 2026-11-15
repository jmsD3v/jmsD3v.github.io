import type { MetadataRoute } from 'next'

const BASE = 'https://jmsilva.dev'

// Al sumar un caso de estudio nuevo, agregar su ruta acá.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/casos/arquitectura-nube`, changeFrequency: 'yearly', priority: 0.7 },
  ]
}

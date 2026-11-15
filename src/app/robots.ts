import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/dev-swatch' },
    sitemap: 'https://jmsilva.dev/sitemap.xml',
  }
}

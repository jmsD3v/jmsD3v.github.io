// Footer del sitio, compartido por la home y las páginas de casos de estudio.
export function SiteFooter() {
  return (
    <footer className="py-4 text-center text-text-muted text-xs border-t border-surface">
      Copyright © {new Date().getFullYear()} Desarrollado desde Las Breñas con 💜 por{' '}
      <a
        href="https://www.linkedin.com/in/jmsilva83"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline"
      >
        @jmsDev
      </a>{' '}
      · All rights reserved
    </footer>
  )
}

/** Badge digital verificable (Credly). */
export interface CredlyBadge {
  id: string
  name: string
  issuer: string
  /** Fecha de emisión ya formateada, p. ej. "nov. 2025". */
  issued: string
  imageSrc: string
  url: string
}

/** Formación destacada con temario y credencial verificable. */
export interface FeaturedDiploma {
  title: string
  issuer: string
  issued: string
  summary: string
  credentialUrl: string
  credentialLabel: string
  modules: { name: string; detail?: string }[]
}

export interface CarouselItem {
  id: string
  title: string
  issuer: string
  status: string
  period?: string
  description?: string
  imageSrc?: string
  badgeSrc?: string
  /** URL pública para verificar la credencial (Credly, POK, etc.). */
  credentialUrl?: string
}

import { ImageResponse } from 'next/og'
import { CASO_NUBE as caso } from './content'

export const alt = caso.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Portada para compartir el caso (LinkedIn, WhatsApp, X). Misma paleta que la página.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #111111 0%, #1b1426 100%)',
          color: '#e2e8f0',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: -140,
            width: 460,
            height: 460,
            borderRadius: 9999,
            border: '2px solid rgba(192,132,252,0.25)',
            display: 'flex',
          }}
        />
        <div style={{ fontSize: 24, letterSpacing: 6, color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
          {caso.kicker}
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.12, marginTop: 24, maxWidth: 980 }}>
          {caso.title}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
          {caso.chips.map((c) => (
            <div
              key={c}
              style={{
                fontSize: 22,
                padding: '8px 18px',
                borderRadius: 9999,
                border: '1px solid rgba(192,132,252,0.45)',
                background: 'rgba(192,132,252,0.12)',
              }}
            >
              {c}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34, fontSize: 22, color: '#94a3b8' }}>
          Proyecto académico · TECLAB · jmsilva.dev
        </div>
      </div>
    ),
    size,
  )
}

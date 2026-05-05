// src/app/dev-swatch/page.tsx
// TEMPORARY — delete before production deploy (tracked in Phase 5 polish plan).
// Purpose: visual verification that @theme tokens and glitch @keyframes work correctly.

export default function DevSwatchPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', minHeight: '100vh', background: '#0a0a0a' }}>
      <h1 style={{ color: '#00ff41', marginBottom: '2rem', fontSize: '1.5rem' }}>
        jms-folio — Design Token Swatch
      </h1>

      {/* Color palette swatches */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1rem' }}>
          Color Palette (@theme tokens)
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { name: '--color-bg', hex: '#0a0a0a', label: 'Background' },
            { name: '--color-surface', hex: '#111111', label: 'Surface' },
            { name: '--color-accent', hex: '#00ff41', label: 'Accent (Terminal Green)' },
            { name: '--color-accent-dim', hex: '#00cc33', label: 'Accent Dim' },
            { name: '--color-text', hex: '#e2e8f0', label: 'Text' },
            { name: '--color-text-muted', hex: '#64748b', label: 'Text Muted' },
          ].map(({ name, hex, label }) => (
            <div key={name} style={{ textAlign: 'center', width: '150px' }}>
              <div
                style={{
                  width: '150px',
                  height: '70px',
                  backgroundColor: hex,
                  border: '1px solid #333',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                }}
              />
              <div style={{ color: '#e2e8f0', fontSize: '0.7rem', lineHeight: 1.4 }}>{label}</div>
              <div style={{ color: '#64748b', fontSize: '0.65rem' }}>{hex}</div>
              <code style={{ color: '#64748b', fontSize: '0.6rem' }}>{name}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Tailwind utility class verification */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1rem' }}>
          Tailwind Utility Classes (from @theme)
        </h2>
        <div className="bg-surface p-4 rounded mb-2">
          <span className="text-accent font-mono text-sm">text-accent on bg-surface</span>
        </div>
        <div className="bg-bg border border-accent p-4 rounded mb-2">
          <span className="text-text font-mono text-sm">text-text on bg-bg</span>
        </div>
        <div className="bg-bg p-4 rounded mb-2">
          <span className="text-text-muted font-mono text-sm">text-text-muted (decorative only)</span>
        </div>
      </section>

      {/* Glitch @keyframes verification */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1rem' }}>
          Glitch @keyframes
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
          Two pseudo-element layers (cyan + magenta) animate with offset timing.
          Should cycle every 3 seconds. Static if OS has prefers-reduced-motion enabled.
        </p>
        <h1
          className="glitch"
          data-text="JUAN MANUEL SILVA"
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#e2e8f0',
            display: 'inline-block',
          }}
        >
          JUAN MANUEL SILVA
        </h1>
      </section>

      {/* Scanline and cursor-blink keyframes smoke test */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1rem' }}>
          Cursor Blink @keyframes
        </h2>
        <span
          style={{
            color: '#00ff41',
            fontSize: '1.5rem',
            display: 'inline-block',
            animation: 'cursor-blink 1s step-end infinite',
          }}
        >
          █
        </span>
      </section>

      <p style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
        /dev-swatch — temporary verification page. Delete before production deploy.
      </p>
    </div>
  )
}

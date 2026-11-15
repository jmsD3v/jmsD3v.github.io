'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* reducedMotion="user": con "reducir movimiento" activado, Framer Motion
          deja de mover y escalar, y solo hace fundidos. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

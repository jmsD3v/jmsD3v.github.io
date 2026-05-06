/**
 * Pixel background palettes — plain TS, importable from both
 * Server and Client components without 'use client' boundary issues.
 */

const mkPalette = (h: number): string[] => [
  `hsl(${h} 100% 55%)`,
  `hsl(${h}  80% 68%)`,
  `hsl(${h}  60% 78%)`,
  `hsl(${h}  40% 88%)`,
  `hsl(${h}  15% 94%)`,
]

export const PIXEL_PALETTES = {
  about:    mkPalette(130),  // green  → matches accent #00ff41
  dev:      mkPalette(210),  // blue
  projects: mkPalette(30),   // orange / amber
  contact:  mkPalette(270),  // purple / violet
  hacker: [
    'hsl(0   100% 60%)',
    'hsl(10  100% 55%)',
    'hsl(188 100% 55%)',
    'hsl(195 100% 60%)',
    'hsl(280  80% 70%)',
  ],
} as const satisfies Record<string, string[]>

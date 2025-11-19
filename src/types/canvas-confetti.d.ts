declare module 'canvas-confetti' {
  export type Confetti = (opts?: any) => void;
  export function create(
    canvas?: HTMLCanvasElement | undefined,
    opts?: any
  ): any;
  const confetti: Confetti & { create?: typeof create };
  export default confetti;
}

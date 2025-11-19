// Allow importing CSS files (side-effect imports) in TypeScript
// This file silences errors like: "Cannot find module 'aos/dist/aos.css' or its corresponding type declarations."

declare module '*.css';
declare module 'aos/dist/aos.css';

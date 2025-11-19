// Minimal type declaration to silence "Could not find a declaration file" errors
// for the `sanitize-html` package during TypeScript builds (e.g. Vercel).
// If you prefer stricter typings, install `@types/sanitize-html` when available
// and remove this file.

declare module 'sanitize-html' {
  type AllowList = Record<string, any>;

  interface SanitizeOptions {
    allowedTags?: string[] | false;
    allowedAttributes?: Record<string, string[]>;
    allowedSchemes?: string[];
    [key: string]: any;
  }

  function sanitizeHtml(dirty: string, options?: SanitizeOptions): string;

  export = sanitizeHtml;
}

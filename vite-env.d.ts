// FIX: Removed the triple-slash reference to "vite/client" to resolve a "Cannot find type definition file" error.
// The manual definitions below provide the necessary types for the project's use of `import.meta.env`.

// FIX: Added explicit type definitions for Vite's `import.meta.env` object.
// This resolves the "Property 'env' does not exist on type 'ImportMeta'" errors
// by informing TypeScript about the custom environment variables used in the project,
// such as VITE_API_KEY.
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

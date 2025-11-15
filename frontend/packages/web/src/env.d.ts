declare global {
  interface ImportMetaEnv {
    readonly VITE_GRAPHQL_URL?: string;
    // add other VITE_ env vars here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

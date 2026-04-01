declare global {
  interface ImportMetaEnv {
    readonly VITE_CLIENT_ID?: string;
    readonly VITE_GRAPHQL_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

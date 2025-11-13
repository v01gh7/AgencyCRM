/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_GOOGLE_CLIENT_SECRET: string
    readonly VITE_GOOGLE_REDIRECT_URI: string
    readonly VITE_GOOGLE_TOKEN_URI: string
    readonly VITE_GOOGLE_AUTH_URI: string
    readonly VITE_GOOGLE_CERTS_URL: string
    readonly VITE_GOOGLE_PROJECT_ID: string
    readonly VITE_GOOGLE_ORIGIN: string
    readonly VITE_GOOGLE_ADS_DEV_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

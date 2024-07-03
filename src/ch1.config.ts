import dotenv from 'dotenv'
dotenv.config()

const requiredEnvVars = ['BEARER_TOKEN']

const unsetEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
if (unsetEnvVars.length > 0) {
  throw new Error(
    `The following environment variables are not configured: ${unsetEnvVars.join(', ')}`
  )
}

// ENV
export const BEARER_TOKEN = process.env.BEARER_TOKEN
export const CH1_CLIENT_ID = process.env.CH1_CLIENT_ID
export const CH1_CLIENT_SECRET = process.env.CH1_CLIENT_SECRET

// AUTH CONFIG
export const CH1_AUTH_TOKEN_URL = 'https://auth.sitecorecloud.io/oauth/token'
export const CH1_AUTH_GRANT_TYPE = 'client_credentials'
export const CH1_AUTH_AUDIENCE = 'https://api.sitecorecloud.io'

// API CONFIG
export const CH1_BASE_URL = 'https://content-api.sitecorecloud.io'
export const CH1_CONTENT_TYPE_URL = '/api/content/v1/types'
export const CH1_TAXONOMY_URL = '/api/content/v1/taxonomies'
export const CH1_CONTENT_URL = '/api/content/v1/items'
export const CH1_MEDIA_URL = '/api/content/v1/media'
export const VERSION_BACKUP_FILES = true
export const PAGE_SIZE = 40

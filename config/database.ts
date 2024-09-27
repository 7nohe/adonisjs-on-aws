import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const credentials = JSON.parse(env.get('POSTGRES_CREDENTIALS_JSON') ?? '{}')

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST') ?? credentials.host,
        port: env.get('DB_PORT') ?? credentials.port,
        user: env.get('DB_USER') ?? credentials.username,
        password: env.get('DB_PASSWORD') ?? credentials.password,
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig

import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
})

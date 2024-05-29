import { Pool } from "pg";

const db = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT as unknown as number,
  database: process.env.PG_DATABASE
})

export default db;
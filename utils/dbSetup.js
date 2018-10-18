const { Pool } = require('pg');
const { env } = process;

const db_url =
  env.NODE_ENV === 'development'
    ? env.DEV_DATABASE_URL
    : env.DATABASE_URL || env.PROD_DATABASE_URL;
console.log('db: ', db_url);
const pool = new Pool({
  connectionString: db_url,
  max: 20,
  ssl: process.env.CLOUD,
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};

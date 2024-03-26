import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
config();

export const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'money_orders',
    port: 5432,
});




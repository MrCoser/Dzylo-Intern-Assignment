import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const root_username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const db = createPool({
    host: "127.0.0.1",
    port: 3306,
    user: root_username,
    password: password,
    database: database,
});

export default db;
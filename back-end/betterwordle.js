import config from "./config";
import Postgres from 'pg';

const sql = new Postgres.Client(config);
sql.connect();

sql.on('error', (err) => {
    console.error('SQL Fail', err);
    sql.end();
});
import config from "./config.js";
import Postgres from 'pg';

const sql = new Postgres.Client(config);
sql.connect();

sql.on('error', (err) => {
    console.error('SQL Fail', err);
    sql.end();
});

export async function listWords() {
    const q = 'SELECT * FROM words';
    const result = await sql.query(q);
    return result.rows;
}

export async function findWord(id) {
    const q = 'SELECT * FROM words WHERE id = $1;';
    const result = await sql.query(q, [id]);
    return result.rows[0];
}

export async function addWord(word) {
    const q = 'INSERT INTO words (word) VALUES ($1);';
    await sql.query(q, [word]);
    return listWords
}

export async function editMessage(updatedWord) {
    const q = 'UPDATE words SET word = $1 WHERE id =$2'
    await sql.query(q, [updatedWord.word, updatedWord.id]);
    return findWord(updatedWord.id)
}
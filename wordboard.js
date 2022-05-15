import uuid from 'uuid-random';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'


async function init() {
    // open the database
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })

    await db.migrate({ migrationsPath: './migrations-sqlite' });

    return db
}

const dbConn = init();


// List words from database
export async function listWords() {
    const db = await dbConn;
    return db.all('SELECT * FROM Words')

}

//get word by ID
export async function findWord(id) {
    const db = await dbConn;
    return db.get('SELECT * FROM Words WHERE id = ?', id);
}

export async function addWord(word) {
    const db = await dbConn;
    const id = uuid();
    await db.run('INSERT INTO Words VALUES (?,?)', [id, word]);
    return listWords(); // Check
}

export async function editWord(updatedWord) {
    const db = await dbConn;
    const id = updatedWord.id;
    const word = updatedWord.word;

    const statement = await db.run('UPDATE Words SET word = ?, WHERE id = ?'[word, id]);

    if (statement.changes === 0) throw new Error('word not found');
    return findWord(id);

}
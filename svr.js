import express from 'express';
import * as wb from './wordboard.js';

const app = express();

app.use(express.static('client', { extensions: ['html'] }));

async function getWords(req, res) {
    res.json(await wb.listWords());
}

async function getWord(req, res) {
    const result = await wb.findWord(req.params.id);
    if (!result) {
        res.status(404).send('No match for that ID');
    }
    res.json(result);
}

async function postWord(req, res) {
    const words = await wb.addWord(req.body.word);
    res.json(words)
}

async function putWord(req, res) {
    const word = await wb.editWord(req.body);
    res.json(word);
}

async function compareWord(req, res) {
    let results = [];
    const guessWord = req.params.word
    const day = new Date().getDate();
    const getWordOfTheDay = await wb.findWord(day);
    for (guessWord.length())
}

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}


app.get('/words', asyncWrap(getWords));
app.get('/words/:id', asyncWrap(getWord))
app.put('/words/:id', express.json(), asyncWrap(putWord));
app.post('/words/', express.json(), asyncWrap(postWord));
app.get('/compare/:word', asyncWrap(compareWord));

app.listen(8080);
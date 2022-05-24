import express from 'express';
import * as wb from './wordboard.js';

const app = express();
const day = new Date().getDate();

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
    const guessWord = req.params.word
    const getWordOfTheDay = await wb.getJustWord(day);
    const result = compare(guessWord, getWordOfTheDay.word)
    res.send(result);
}

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}

function compare(guess, target) {
    let results = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess.charAt(i) === target.charAt(i)) {
            results.push("correct")
        }
        else if (target.includes(guess.charAt(i))) {
            results.push("wrong-location");
        } else {
            results.push("wrong");
        }
    }
    return results;
}


app.get('/words', asyncWrap(getWords));
app.get('/words/:id', asyncWrap(getWord))
app.put('/words/:id', express.json(), asyncWrap(putWord));
app.post('/words/', express.json(), asyncWrap(postWord));
app.get('/compare/:word', asyncWrap(compareWord));

app.listen(8080);
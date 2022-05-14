import express from 'express';
import * as bw from './betterwordle.js';

const app = express()

app.use(express.static('client', { extensions: ['html'] }));

async function getWords(req, res) {
    res.json(await bw.listWords());
}

async function getWord(req, res) {
    const result = await bw.findWord(req.params.id);
    if (!result) {
        res.status(404).send("No match for that ID.");
        return;
    }
    res.json(result);
}

async function addWord(req, res) {
    const word = await bw.addWord(req.body.msg);
    res.json(word);
}

async function putWord(req, res) {
    const word = await bw.updateWord(req.body);
    res.json(message);
}

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}

app.get('/word', asyncWrap(getWords));
app.get('/word/:id', asyncWrap(getWord));
app.put('/word/:id', express.json(), asyncWrap(putWord));
app.post('/word', express.json(), asyncWrap(addWord));

app.listen(8080);
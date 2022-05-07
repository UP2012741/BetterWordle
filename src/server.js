import * as bw from './betterwordle.js';

const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


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
    const messages = await bw.addWord(req.body.msg )
}
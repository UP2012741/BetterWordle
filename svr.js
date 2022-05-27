import express from 'express';
import * as wb from './wordboard.js';

const app = express();
const day = new Date().getDate();

app.use(express.static('client', { extensions: ['html'] }));
//Get the list of words
async function getWords(req, res) {
    res.json(await wb.listWords());
}
//Gets word and its id depending on its ID
async function getWord(req, res) {
    const result = await wb.findWord(req.params.id);
    if (!result) {
        res.status(404).send('No match for that ID');
    }
    res.json(result);
}
//add a word to the database
async function postWord(req, res) {
    const words = await wb.addWord(req.body.word);
    res.json(words)
}

//edit word in the database depedning on its id 
async function putWord(req, res) {
    const word = await wb.editWord(req.body);
    res.json(word);
}

//Compares sumbitted word with the word of the day
async function compareWord(req, res) {
    const guessWord = req.params.word
    const getWordOfTheDay = await wb.getJustWord(day);
    const result = compare(guessWord, getWordOfTheDay.word)
    res.send(result);
}

//Gets the word of the day
async function WordOfTheDay(req, res) {
    const word = await wb.getJustWord(day);
    res.json(word);
}

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}

//Function that compares the word of the day and the guessed word. Returning an array 
function compare(guess, target) {
    let results = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess.charAt(i) === target.charAt(i)) {
            results.push("correct")
        }
        else if (target.includes(guess.charAt(i))) {
            results.push("present");
        } else {
            results.push("absent");
        }
    }
    return results;
}


app.get('/words', asyncWrap(getWords));
app.get('/words/:id', asyncWrap(getWord))
app.put('/words/:id', express.json(), asyncWrap(putWord));
app.post('/words/', express.json(), asyncWrap(postWord));
app.get('/compare/:word', asyncWrap(compareWord));
app.get('/WordOfTheDay', asyncWrap(WordOfTheDay))
app.listen(8080); 
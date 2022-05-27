# README

##SETUP

*npm install
*npm start

## How it gets the word of the day

The word of the day is stored in an sqlite database at the back end. The word depends on the day of the month 1 - 31. Ideally if I had more time I would have a word for every date for the next few years, however due to time constraints this was the best way. 

![image](https://user-images.githubusercontent.com/91620319/170783074-c388c5b6-b483-4869-9b2d-0dae5e74941c.png)

When user submits a valid guess. The compareWord(guess) function is called. This calls the compare/word api which will go into the database and retrive the word of the day depdning on the date. It will then compare the guess with the word of the day. It will then return an array with values of either "correct", "present" or "absent".

## FEATURES

* Hover Feature - This highlights when hovering over the virutal keyboard to make it eaiser for the user to see what they are hovering
![image](https://user-images.githubusercontent.com/91620319/170781046-2a627a2a-5b04-4bb9-a6bb-f0dfe74de62d.png)
![image](https://user-images.githubusercontent.com/91620319/170781088-868e2807-a64e-4b14-a3bf-e701a1cb6008.png)

* Keyboard changes color depending on its status on the board. For example:

![image](https://user-images.githubusercontent.com/91620319/170781317-dceba522-7e7f-4d85-a902-2cf681dd5935.png)

* Tile Flips:
 
![image](https://user-images.githubusercontent.com/91620319/170781502-e6afffb8-098c-46a6-98f4-a238735c7b2b.png)

* Statistics are shown after the game ends:

![image](https://user-images.githubusercontent.com/91620319/170781554-b72162a0-7ab3-4787-87ab-5b610d3d91a7.png)

* Notifes and shakes the tiles when the word submitted does not exist using the provided dictionary API:

![image](https://user-images.githubusercontent.com/91620319/170781997-212fdeba-66f2-4ef4-b049-ffa785c91add.png)

* You win and You lose notification is sent as well:

![image](https://user-images.githubusercontent.com/91620319/170782192-a22b2476-1f61-400c-8708-d612bf50f3e3.png)

* Game state is saved in local storage. This means if you refresh the page. the state of the game is kept

* Does not show two yellow boxes of the same letter even if the word of the day has two of that letter

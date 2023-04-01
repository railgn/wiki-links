Actual to do:

-sync up round endings (flag for when everyone is done OR timer on server)

when a players round ends, update there HUD score display with a green "O" or red "X" for if they got the correct answer.

when entire round ends, update scores (or just do it at same time as above)

////////////////////////////////////////

finish single player version

add lobbies, multiplayer with websockets

multiplayer needs to share:
-score
-round over (true or false)
-category
-article chosen
-links chosen
-next round click (everyone has a ready button?)

To do:

-Round input at beginning (or just default to 10)

Done:

-on game: add hyperlinks to both articles on round end (use url decode/encode)
-on button: add change of color and text for correct/incorrect on round end
-add streak as part of score?

-at end of 10 rounds, have landing page where it displays:

1. your score
2. list of hi scores (set up database that automatically posts score after 10 rounds)
   (database stores: Score, Time of submission, Categories chosen, and a nickname)
3. Buttons for "Play Again?" and "Category Select"

Websocket planning:

-HAVE TIMER BE ON THE SERVER SIDE
-Only thing server is waiting for from the client is:
-if they got any points
-ready for next round

Questions:
-Should the game creator be a server or a client with special priveledges?
-if the game creator is the server, what happens when they reload the page/disconnect?
-If the server is seperate, when should that server be terminated?
-after a set amount of time with 0 clients connected?

Index:

Text box for entering Nickname
-if none is entered, generate "Anonymous Animal"

Create Game Button:
-generates game URL
-creates server for that URL
-creates client for current user
-game URL starts on a lobby page with:
-filters
-game options
-all current players
-start game button

Join Game Textbox and Button:
-sends user to game URL based on textbox value
-creates client for current user
-sees the same UI on the lobby page, but can't interact

Game is started:

-Client sends filters/game options to the server
-server updates its states and sends info to clients:
-game has started

Each round:
-server generates and shares:
-link, answer choices, time limit, round #, everyone's scores
-clients share:
-score earned on current round
-when they have finished their round
-once all client rounds are finished-
-the game creator client will be prompted to start next round
(or this could be a timed event after a few seconds)

Game end:
-shows everyone's scores
-option to play again

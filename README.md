WIP

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

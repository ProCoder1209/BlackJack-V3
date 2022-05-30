let deckId = "";
let points = 0;
let enemyPoints = 0;
let playerCards = [];
let enemyCards = [];
window.onload = function () {
	
	// Page when window loads
  document.getElementById("message").innerHTML =
    "<span class='title'>BlackJack</span><br><span class='smalltext'> The object of the game is to win money by creating card totals higher than those of the dealer's hand but not exceeding 21, or by stopping at a total in the hope that dealer will bust. <br> (EXCEPT THIS VERSION IS FREE)</span>";
  document.getElementById("dealbutton").style.display = "inline";
  document.getElementById("hitbutton").style.display = "none";
  document.getElementById("standbutton").style.display = "none";
  document.getElementById("enemypts").style.display = "none";
  document.getElementById("yourpts").style.display = "none";
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((response) => response.json())
    .then((data) => (deckId = data.deck_id));
};

function startGame() {
	
	// When game starts, this will be effective
  document.getElementById("dealbutton").style.display = "none";
  document.getElementById("hitbutton").style.display = "inline";
  document.getElementById("standbutton").style.display = "inline";
  document.getElementById("enemypts").style.display = "inline";
  document.getElementById("yourpts").style.display = "inline";
  document.getElementById("message").innerHTML = "";
  points = 0;
  enemyPoints = 0;
  showCard = 0;
  playerCards = [];
  enemyCards = [];
  // fetches deck for game setup
  fetch(
    "https://deckofcardsapi.com/api/deck/" + deckId + "/shuffle/?deck_count=1"
  )
    .then((response) => response.json())
    .then((data) => setup(data)); //setup with deck data
}

function setup(data) {
  console.log(data);
  
  
 // draws 2 cards (1 for each) to start game
  fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2")
    .then((response) => response.json())
    .then((data1) => update(data1, 0)) // draw card from this deck for player
    .then(() =>
      fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2")
        .then((response) => response.json())
        .then((data2) => update(data2, 1))
    ); //draw card from this deck for enemy
} //sets up new round

function hit(side) {
	// functional for both player and dealer (Hit Button)
  fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1")
    .then((response) => response.json())
    .then((data) => update(data, side)); //draw card from this deck
} //draw 1 card

function update(data, side) {
  console.log(data);
  
  // continue hitting, updates deck
  if (data != 0) {
    for (a = 0; a < data.cards.length; a += 1) {
      console.log(data.cards[a]);
      if (side == 0) {
        enemyCards.push(data.cards[a]); // add new card to enemy hand
        console.log(enemyCards);
      } else if (side == 1) {
        playerCards.push(data.cards[a]); // add new card to player hand
        console.log(playerCards);
      }
    }
  }
  
 // counts enemy points
  enemyPoints = 0;
  totalAces = 0;
  document.getElementById("enemycards").innerHTML = "";
  for (a = 0; a < enemyCards.length; a += 1) {
    if (a == 1 && showCard == 0) {
      document.getElementById("enemycards").innerHTML +=
	  // shows back of a card
        "<img src='https://deckofcardsapi.com/static/img/back.png' alt=''>";
    } else {
		// shows the dealers card
      document.getElementById("enemycards").innerHTML +=
        "<img src='" + enemyCards[a].images.png + "' alt=''>";
    }
	
	// if a card has a value between 2-10, give it that value
    if (enemyCards[a].value >= 2 && enemyCards[a].value <= 10) {
      enemyPoints += parseInt(enemyCards[a].value);
    } else if (enemyCards[a].value == "ACE") {
      totalAces += 1;
    } else {
      enemyPoints += 10;
    }
  }
}
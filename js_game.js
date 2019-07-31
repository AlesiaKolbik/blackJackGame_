const BUTTON_GAME = document.getElementById('game');
const BUTTON_HIT = document.getElementById('hit');
const BUTTON_PASS = document.getElementById('pass');
const USER_CARD_FIELD =  document.getElementById('user_game_field');
const PARTNER_CARD_FIELD =  document.getElementById('partner_game_field');
const MODAL_WINDOW =  document.getElementById('modal_window');
const USER_GAME_SCORE_DECK = document.getElementById('user_game_score');
const PARTNER_GAME_SCORE_DECK = document.getElementById('partner_game_score');
const USER_SCORE = document.getElementById('user_score');
const PARTNER_SCORE = document.getElementById('partner_score');
const INPUT_FIELD_BLOCK = document.getElementById('input_field_block');
const INPUT_FIELD = document.getElementById('input_field');
const INPUT_FIELD_BTN = document.getElementById('input_field_btn');

let userScore = 0;
let partnerScore = 0;
let blackJack = 21;
let userName = 'USER';
let USERCARDS = [];
let PARTNERCARDS = [];
const DECK = [];
const SUITS = [{s:'Clubs', c:0}, {s:'Diamonds',c: -243}, { s: 'Hearts', c:-486}, {s:'Spades', c:-729}];
const RANKS = [
	{r:'Ace',c:0, v:1},
	{r:2, c:-168, v:2},
	{r:3, c:-335, v:3},
	{r:4, c:-503, v:4},
	{r:5, c:-670, v:5},
	{r:6, c:-837, v:6},
	{r:7, c:-1005, v:7},
	{r:8, c:-1173, v:8},
	{r:9, c:-1340, v:9},
	{r:10 ,c:-1507, v:10},
	{r:'Jack', c:-1675, v:10},
	{r:'Queen', c:-1842, v:10},
	{r:'King', c:-2009, v:10}
	];

window.addEventListener('load', function()
{
	getUserName();
	createDeck();
	shuffleCards();
});

function createDeck()
{
	for(let suitIndex = 0, suitsLength = SUITS.length; suitIndex < suitsLength; suitIndex+=1)
	{
		for(let rankIndex = 0, rankLength = RANKS.length; rankIndex < rankLength; rankIndex+=1)
		{
			DECK.push({suit: SUITS[suitIndex].s, rank: RANKS[rankIndex].r, coordX: RANKS[rankIndex].c, coordY:SUITS[suitIndex].c, value: RANKS[rankIndex].v});
		}
	}
	console.log(DECK);
}

BUTTON_GAME.addEventListener('click', function ()
{
	startGame();
	dealCards();
	USER_GAME_SCORE_DECK.style.display = "block";
	PARTNER_GAME_SCORE_DECK.style.display = "block";
	USER_SCORE.innerHTML = userScore;
	PARTNER_SCORE.innerHTML = partnerScore;
});

BUTTON_PASS.addEventListener('click', function ()
{
	stopGame();
});

BUTTON_HIT.addEventListener('click', function ()
{
	getCard('user');
	if(partnerScore < blackJack)
	{
		getCard('partner');
	}
});

INPUT_FIELD_BTN.addEventListener('click', function (e)
{
	e.preventDefault();
	let name = INPUT_FIELD.value;
	console.log(name);
	userName = name !== "" ? name : "USER";
	INPUT_FIELD_BLOCK.style.display = "none";
});

function shuffleCards()
{
	for(let cardIndex = 0, deckLength = DECK.length; cardIndex < deckLength; cardIndex+=1)
	{
		let randomIndex = Math.trunc( Math.random()* deckLength);
		let tmp = DECK[cardIndex];
		DECK[cardIndex] = DECK[randomIndex];
		DECK[randomIndex] = tmp;
	}
}

function dealCards()
{
	let i = 1;
	while (i < 3) {
		getCard('user');
		getCard('partner');
		i+=1;
	}
}

function startGame()
{
	BUTTON_GAME.style.display = "none";
	BUTTON_HIT.style.display = "inline-block";
	BUTTON_PASS.style.display = "inline-block";
	PARTNER_CARD_FIELD.innerHTML ="";
	USER_CARD_FIELD.innerHTML = '<div class="user_name">'+ userName +'</div>';
}

function stopGame()
{
	BUTTON_GAME.style.display = "inline-block";
	BUTTON_HIT.style.display = "none";
	BUTTON_PASS.style.display = "none";
	showResult();
	userScore = 0;
	partnerScore = 0;
	USERCARDS = [];
	PARTNERCARDS = [];
}

function getCard(user)
{
	if(DECK.length === 0){
		createDeck();
		shuffleCards();
	}
	let card = DECK.shift();
	if(user === 'user')
	{
		USERCARDS.push(card);
		setCardToHTML('user', card);
		userScore += card.value;
		USER_SCORE.innerHTML = userScore;
	}
	else
	{
		PARTNERCARDS.push(card);
		setCardToHTML('partner', card);
		partnerScore += card.value;
		PARTNER_SCORE.innerHTML = partnerScore;
	}

	if(userScore === blackJack || partnerScore === blackJack || userScore > blackJack || partnerScore > blackJack)
	{
		stopGame();
	}

}

function setCardToHTML(user, card)
{
	let htmlElem = document.createElement('div');
	htmlElem.setAttribute('class', 'card');
	htmlElem.style.backgroundPosition = card.coordX + "px "+ card.coordY + "px";
	if(user === 'user')
	{
		USER_CARD_FIELD.appendChild(htmlElem);
	}
	else {
		PARTNER_CARD_FIELD.appendChild(htmlElem);
	}

}

function getUserName()
{
	INPUT_FIELD_BLOCK.style.display = "block";
	INPUT_FIELD.value = "";
}

function showResult()
{
	let message = userName;
	if(userScore > partnerScore && userScore <= blackJack  && partnerScore <= blackJack ||
	   userScore <= blackJack && partnerScore > blackJack)
	{
		message += ", you won!"
	}
	else if(userScore < partnerScore && userScore <= blackJack && partnerScore <= blackJack ||
		userScore > blackJack && partnerScore <= blackJack)
	{
		message += ", you lost!"
	}
	else {
		message += ", game over!"
	}

	message += "<small>YOUR&nbsp;SCORE: " + userScore + "</small>";
	message += "<small>PARTNER&nbsp;SCORE: " + partnerScore +"</small>";
	MODAL_WINDOW.innerHTML = message;
	document.getElementById('alert').style.display = "block";

}

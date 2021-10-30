let blackjackGame = 
{
	'you': {'scoreSpan': '#youscore' , 'div' : '#you' , 'score' : 0},
	'dealer': {'scoreSpan': '#dealerscore' , 'div' : '#dealer' , 'score' : 0},
	'cards': ['2','3','4','5','6','7','8','9','10','K','Q','J','A' ],
	'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
	'wins':0,
	'losses':0,
	'draws':0,
	'isStand':false,
	'turnsOver':false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');


document.querySelector('#hit').addEventListener('click',blackjackHit);
document.querySelector('#stand').addEventListener('click',dealerLogic);
document.querySelector('#deal').addEventListener('click',blackjackDeal);

function blackjackHit()
{
	if(blackjackGame['isStand']===false)
	{
	let card = randomCard();
	showCard(card, YOU);
	updateScore(card, YOU);
	showScore(YOU);
	}
}
function blackjackDeal()
{
	if(blackjackGame['turnsOver']===true)
	{
		blackjackGame['isStand']=false; 
	let yourImages=document.querySelector('#you').querySelectorAll('img');
	let dealerImages=document.querySelector('#dealer').querySelectorAll('img');
	
	for(i=0 ; i<yourImages.length ; i++)
	{
		yourImages[i].remove();
	}
	for(i=0 ; i<dealerImages.length ; i++)
	{
		dealerImages[i].remove();
	}
	YOU['score']=0;
	DEALER['score']=0;
	document.querySelector('#youscore').textContent=0;
	document.querySelector('#youscore').style.color='white';
	document.querySelector('#dealerscore').textContent=0;
	document.querySelector('#dealerscore').style.color='white';
	document.querySelector('#blackjackResult').textContent='DAAB DO PLAY KA BUTTON';
	document.querySelector('#blackjackResult').style.color='silver';
	blackjackGame['turnsOver']=true; 
	}
}
function randomCard()
{
	let randomIndex= Math.floor(Math.random() * 13);
	return blackjackGame['cards'][randomIndex];
}
function showCard(card, activePlayer)
{
	if(activePlayer['score']<21)
	{
	let cardImage= document.createElement('img');
    cardImage.src=`images/${card}.png`;
	document.querySelector(activePlayer['div']).appendChild(cardImage);
	hitSound.play();
	}
}
function updateScore(card, activePlayer)
{
	if(activePlayer['score']<21)
	{
	if(card === 'A')
	{
		if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <=21)
		{activePlayer['score'] += blackjackGame['cardsMap'][card][1];}
	    else
	    {activePlayer['score'] += blackjackGame['cardsMap'][card][0];}
	}
	else
	{activePlayer['score'] += blackjackGame['cardsMap'][card];}
	}
}
function showScore(activePlayer)
{
	if(activePlayer['score']>21)
	{
		document.querySelector(activePlayer['scoreSpan']).textContent='BUST!!';
		document.querySelector(activePlayer['scoreSpan']).style.color='yellow';
	}
    else
	{
	document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
	}
}
function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve,ms));
}
async function dealerLogic()
{
	blackjackGame['isStand']=true;
	while(DEALER['score']<17 && blackjackGame['isStand']=== true)
	{
	let card=randomCard();
	showCard(card, DEALER);
	updateScore(card, DEALER);
	showScore(DEALER);
	await sleep(1000);
	}
	
	blackjackGame['turnsOver']=true;
	let winner=computeWinner();
	showResult(winner);
}
function computeWinner()
{
	let winner;
	if(YOU['score']<=21)
	{
		if(YOU['score']>DEALER['score'] || DEALER['score']>21)
			{
				blackjackGame['wins']++;
				winner=YOU;
				
			}
	    else if(YOU['score']<DEALER['score'])
			{
				blackjackGame['losses']++;
				winner=DEALER;
			}
		else if(YOU['score']===DEALER['score'])
			{blackjackGame['draws']++;}	
	}
	else if(YOU['score']>21 && DEALER['score']<=21)
	{
		blackjackGame['losses']++;
		winner=DEALER;
	}
	else if(YOU['score']>21 && DEALER['score']>21)
	{
		blackjackGame['draws']++;
	}
	return winner;
}
function showResult(winner)
{
	if(blackjackGame['turnsOver']===true)
	{
	let message,messageColor;
	if(winner===YOU)
	{
		document.querySelector('.wins').textContent = blackjackGame['wins'];
		message='You Won!';
		messageColor='green';
		winSound.play();
	}
	else if(winner===DEALER)
	{
		document.querySelector('.losses').textContent = blackjackGame['losses'];
		message='You Lose!';
		messageColor='red';
		lossSound.play();
	}
	else
	{
		document.querySelector('.draws').textContent = blackjackGame['draws'];
		message='You Drew!';
		messageColor='orange';
	}
	document.querySelector('#blackjackResult').textContent=message;
	document.querySelector('#blackjackResult').style.color=messageColor;
	}
}
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points'),
  },
  cardsSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCard: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card'),
  },
  playerSides: {
    player1: 'player-cards',
    playerIdBox: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerIdBox: document.querySelector('#computer-cards'),
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
};

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: './src/assets/icons/dragon.png',
    windOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: './src/assets/icons/magician.png',
    windOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: './src/assets/icons/exodia.png',
    windOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId(){
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
};

async function createCardImage(idCard, fieldSide){
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  cardImage.setAttribute('data-id', idCard);
  cardImage.classList.add('card');

  if(fieldSide === state.playerSides.player1){
    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(idCard);
    });

    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  };

  return cardImage;
};

async function drawSelectCard(id){
  state.cardsSprites.avatar.src = cardData[id].img;
  state.cardsSprites.name.innerText = cardData[id].name;
  state.cardsSprites.type.innerText = 'Atribute: ' + cardData[id].type;
};

async function setCardsField(cardId){
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();

  state.fieldCard.player.style.display = 'block';
  state.fieldCard.computer.style.display = 'block';

  state.fieldCard.player.src = cardData[cardId].img;
  state.fieldCard.computer.src = cardData[computerCardId].img;

  let duelResult = await checkDuelresults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResult);
};

async function removeAllCardsImages(){
  let { computerIdBox, playerIdBox } = state.playerSides;
  let imgElements = computerIdBox.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());

  imgElements = playerIdBox.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());
};

async function checkDuelresults(playerCardId, computerCardId){
  let duelResults = 'Draw!';
  let playerCard = cardData[playerCardId];

  if(playerCard.windOf.includes(computerCardId)){
    duelResults = 'You Win!';
    state.score.playerScore++;
    await playAudio('win');
  } else if (playerCard.loseOf.includes(computerCardId)){
    duelResults = 'You Lose!';
    state.score.computerScore++;
    await playAudio('lose');
  }

  return duelResults;
};

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

async function drawButton(text){
  state.actions.button.innerText = text;
  state.actions.button.style.display = 'block';
};

async function drawCards(cardNumbers, fieldSide){
  for(let i = 0; i < cardNumbers; i++){
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
};

async function resetDuel(){
  state.cardsSprites.avatar.src = '';
  state.actions.button.style.display = 'none';
  state.fieldCard.player.style.display = 'none';
  state.fieldCard.computer.style.display = 'none';

  init();
};

async function playAudio(status){
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  try {
    audio.play();
  } catch (error) {
    console.error(error + 'can not play the audio');
  }
};

function init(){
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);
};

init();
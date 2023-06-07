
const container = document.querySelector('.container');
const cards = document.querySelectorAll('.card');
const cardWidth = cards[0].offsetWidth;
const arrowLeft = document.querySelector('#left-arrow');
const arrowRight = document.querySelector('#right-arrow');
let currentIndex = 0;

arrowLeft.addEventListener('click', slideLeft);
arrowRight.addEventListener('click', slideRight);


function updateArrowState() {

  if (currentIndex === 0) {
    arrowLeft.classList.add('disabled');
    arrowRight.classList.remove('disabled');
  } else if (currentIndex === cards.length - 1) {
    arrowLeft.classList.remove('disabled');
    arrowRight.classList.add('disabled');
  } else {
    arrowLeft.classList.remove('disabled');
    arrowRight.classList.remove('disabled');
  }
}

function slideLeft() {
  if (currentIndex > 0) {
    currentIndex--;
    const offset = -currentIndex * cardWidth;
    container.style.transform = `translateX(${offset}px)`;
    updateArrowState();
  }
}

function slideRight() {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    const offset = -currentIndex * cardWidth;
    container.style.transform = `translateX(${offset}px)`;
    updateArrowState();
  }
}

updateArrowState();

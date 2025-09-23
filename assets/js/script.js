let currentIndex = 0;
const track = document.getElementById("carouselTrack");
const cardWidth = track.querySelector('.carousel-card') ? track.querySelector('.carousel-card').offsetWidth + 20 : 420; // 20 = gap

function moveCarousel(direction) {
  const totalCards = track.querySelectorAll('.carousel-card').length;
  const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > totalCards - visibleCards) currentIndex = totalCards - visibleCards;

  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  track.style.transition = "transform 0.3s";
}

let productsIndex = 0;

function moveProducts(direction) {
  const track = document.getElementById("productsTrack");
  const productCards = track.querySelectorAll(".product");
  const cardWidth = productCards[0] ? productCards[0].offsetWidth + 20 : 270; // 20 = gap
  const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);

  productsIndex += direction;
  if (productsIndex < 0) productsIndex = 0;
  const maxIndex = Math.max(productCards.length - visibleCards, 0);
  if (productsIndex > maxIndex) productsIndex = maxIndex;

  track.style.transform = `translateX(-${productsIndex * cardWidth}px)`;
  track.style.transition = "transform 0.3s";
}
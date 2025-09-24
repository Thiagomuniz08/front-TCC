// =============================
// CONFIGURAÇÃO DA API
// =============================
const API_URL = "https://back-tcc.vercel.app";

// ------- Usuários -------
async function cadastrarUsuario(dados) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
}

async function loginUsuario(email, senha) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return res.json();
}

// ------- Produtos -------
async function listarProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  return res.json();
}

// ------- Pedidos -------
async function criarPedido(dados) {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
}

// =============================
// CARROSSEL DE SERVIÇOS
// =============================
let currentIndex = 0;
const track = document.getElementById("carouselTrack");
const cardWidth = track.querySelector('.carousel-card')
  ? track.querySelector('.carousel-card').offsetWidth + 20
  : 420; // 20 = gap

function moveCarousel(direction) {
  const totalCards = track.querySelectorAll('.carousel-card').length;
  const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > totalCards - visibleCards) currentIndex = totalCards - visibleCards;

  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  track.style.transition = "transform 0.3s";
}

// =============================
// CARROSSEL DE PRODUTOS
// =============================
let productsIndex = 0;

function moveProducts(direction) {
  const track = document.getElementById("productsTrack");
  const productCards = track.querySelectorAll(".product");
  const cardWidth = productCards[0]
    ? productCards[0].offsetWidth + 20
    : 270; // 20 = gap
  const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);

  productsIndex += direction;
  if (productsIndex < 0) productsIndex = 0;
  const maxIndex = Math.max(productCards.length - visibleCards, 0);
  if (productsIndex > maxIndex) productsIndex = maxIndex;

  track.style.transform = `translateX(-${productsIndex * cardWidth}px)`;
  track.style.transition = "transform 0.3s";
}

// =============================
// CARREGAR PRODUTOS DO BACK
// =============================
async function carregarProdutos() {
  try {
    const produtos = await listarProdutos();
    const track = document.getElementById("productsTrack");

    if (!track) return;

    track.innerHTML = ""; // limpar produtos estáticos

    produtos.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <img src="${prod.imagem}" alt="${prod.nome}">
        <p>${prod.nome}</p>
        <span>R$ ${prod.preco}</span>
        <a href="#" class="btn" onclick="adicionarAoCarrinho(${prod.id}, '${prod.nome}', ${prod.preco})">Adicionar ao Carrinho</a>
      `;
      track.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// =============================
// CARRINHO (localStorage)
// =============================
function adicionarAoCarrinho(id, nome, preco) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const index = carrinho.findIndex(item => item.id === id);

  if (index !== -1) {
    carrinho[index].quantidade++;
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert(`${nome} foi adicionado ao carrinho!`);
}

// =============================
// INICIALIZAÇÃO
// =============================
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
});

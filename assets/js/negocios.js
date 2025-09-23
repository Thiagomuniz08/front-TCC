const main = document.querySelector('#lista-servicos');
let servicos = [];

function adicionarAoCarrinho(id, nome, descricao, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const index = carrinho.findIndex(item => item.id === id);

    if (index !== -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({ id, nome, descricao, preco, imagem, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarPainelLateral(nome, imagem);
}

function mostrarPainelLateral(nomeProduto, imagemProduto) {
    const painel = document.getElementById('carrinho-sidebar');
    const textoProduto = document.getElementById('produto-adicionado');
    const imagemElemento = document.createElement('img');

    textoProduto.textContent = nomeProduto;

    const imagemExistente = painel.querySelector('.imagem-produto-adicionado');
    if (imagemExistente) imagemExistente.remove();

    imagemElemento.src = imagemProduto;
    imagemElemento.alt = nomeProduto;
    imagemElemento.classList.add('imagem-produto-adicionado');
    textoProduto.insertAdjacentElement('beforebegin', imagemElemento);

    painel.classList.add('ativo');
    setTimeout(() => painel.classList.remove('ativo'), 5000);
}

function fecharCarrinho() {
    document.getElementById('carrinho-sidebar').classList.remove('ativo');
}

function verHorario() {
    window.location.href = "horario.html";
}

fetch("assets/json/negocios.json")
  .then(response => response.json())
  .then(data => {
    servicos = data;
    exibirCards();
  })
  .catch(error => console.error("Erro ao carregar JSON:", error));
function exibirCards() {
  servicos.forEach(servico => {
    const precoAntigo = servico.precoAntigo.toFixed(2).replace('.', ',');
    const preco = servico.preco.toFixed(2).replace('.', ',');

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${servico.imagem}" alt="${servico.alt}">
      <h2>${servico.nome}</h2>
      <p>${servico.descricao}</p>
      <p>
        <span style="text-decoration: line-through; color: gray;">R$ ${precoAntigo}</span><br>
        <span style="color: #c4520c; font-weight: bold;">R$ ${preco}</span>
      </p>
      <button class="agendar-button">Agendar</button>
    `;

    // Aqui você seleciona o botão dentro do card
    const agendarBtn = card.querySelector('.agendar-button');

    // E agora adiciona o evento corretamente
    agendarBtn.addEventListener('click', () => {
      localStorage.setItem('servicoSelecionado', JSON.stringify(servico));
      window.location.href = "horario.html";
    });

    main.appendChild(card);
  });
}


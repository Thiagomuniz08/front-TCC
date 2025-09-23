const main = document.querySelector('main');
let produtos = [];

// Função para adicionar ao carrinho
function adicionarAoCarrinho(id, nome, descricao, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const index = carrinho.findIndex((item) => item.id === id);
    if (index !== -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({ id, nome, descricao, preco, imagem, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarPainelLateral(nome, imagem);
}

// Função para mostrar o painel lateral
function mostrarPainelLateral(nomeProduto, imagemProduto) {
    const painel = document.getElementById('carrinho-sidebar');
    const textoProduto = document.getElementById('produto-adicionado');
    const imagemElemento = document.createElement('img');

    textoProduto.textContent = nomeProduto;

    const imagemExistente = painel.querySelector('.imagem-produto-adicionado');
    if (imagemExistente) {
        imagemExistente.remove();
    }

    imagemElemento.src = imagemProduto;
    imagemElemento.alt = nomeProduto;
    imagemElemento.classList.add('imagem-produto-adicionado');
    textoProduto.insertAdjacentElement('beforebegin', imagemElemento);

    painel.classList.add('ativo');

    setTimeout(() => {
        painel.classList.remove('desativo');
    }, 10000);
}

// Função para fechar o carrinho
function fecharCarrinho() {
    const painel = document.getElementById('carrinho-sidebar');
    painel.classList.remove('ativo');
}

// Carregar os produtos do JSON
fetch("assets/json/props.json")
    .then(response => response.json())
    .then(data => {
        produtos = data;
        exibirCards();
    })
    .catch(error => console.error("Erro ao carregar JSON:", error));

// Função para exibir os cards dos produtos
function exibirCards() {
    produtos.forEach(produto => {
        const precoAntigo = produto.precoAntigo.toFixed(2).replace('.', ',');
        const preco = produto.preco.toFixed(2).replace('.', ',');

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.alt}">
            <h2>${produto.alt}</h2>
            <p>${produto.nome}</p>
            <p>
              <span style="text-decoration: line-through; color: gray; ">R$ ${precoAntigo}</span><br>
              <span style="color: orange; font-weight: bold;">R$ ${preco}</span>
            </p>
            <button class="add-to-cart-button">${produto.button}</button>
        `;

        const button = card.querySelector('.add-to-cart-button');
        button.addEventListener('click', () => {
            adicionarAoCarrinho(produto.id, produto.nome, produto.descricao, produto.preco, produto.imagem);
        });

        main.appendChild(card);
    });
}
const botoesComprar = document.querySelectorAll('button[onclick^="adicionarAoCarrinho"]');
botoesComprar.forEach(botao => {
    const onclickCode = botao.getAttribute('onclick');
    const params = onclickCode.match(/\((.*?)\)/)[1].split(',').map(param => param.trim());
    const nomeProduto = params[1].replace(/^'|'$/g, '');
    const imagemProduto = params[4].replace(/^'|'$/g, '');

    botao.addEventListener('click', () => {
        mostrarPainelLateral(nomeProduto, imagemProduto);
    });
});
const menuToggle = document.getElementById('menu-toggle');
const slideMenu = document.getElementById('slide-menu');

menuToggle.addEventListener('click', () => {
    slideMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
})
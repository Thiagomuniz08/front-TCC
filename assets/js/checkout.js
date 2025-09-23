function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function atualizarTabelaCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const tabela = document.getElementById("tabela-produtos");
  const totalGeral = document.getElementById("total-geral");
  tabela.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, idx) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${item.imagem}" alt="${item.nome}" class="img-produto-checkout">
        ${item.nome}
      </td>
      <td>
        <button class="btn-qtd" onclick="alterarQtd(${idx}, -1)">-</button>
        <span class="qtd">${item.quantidade}</span>
        <button class="btn-qtd" onclick="alterarQtd(${idx}, 1)">+</button>
      </td>
      <td>R$ ${(subtotal).toFixed(2)}</td>
      <td>
        <button class="btn-remover" onclick="removerProduto(${idx})"><img src="assets/img/lixo-icon.png" alt="Remover"></button>
      </td>
    `;
    tabela.appendChild(tr);
  });

  totalGeral.textContent = "R$ " + total.toFixed(2);
  document.getElementById("carrinho-json").value = JSON.stringify(carrinho);
}

// Função para alterar quantidade
window.alterarQtd = function(idx, delta) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho[idx].quantidade += delta;
  if (carrinho[idx].quantidade < 1) carrinho[idx].quantidade = 1;
  if (carrinho[idx].quantidade > 25) carrinho[idx].quantidade = 25; 
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTabelaCarrinho();
};

window.removerProduto = function(idx) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(idx, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTabelaCarrinho();
};

// Chama ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarTabelaCarrinho);


const stripe = Stripe('pk_test_51RkRYN2NDHd3ApIM28O0QMgeTuYzJyVi3xUthi7yEksdPT8ltr2V7BvSPLF1vCGpjl6klHKjktDmECqENQa9wVyp006x4eSinZ');

async function realizarPagamento() {
  try {
    const response = await fetch('http://localhost:3000/criar-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ carrinho: obterCarrinho() }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    alert('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
  }
}

function obterCarrinho() {
  // Supondo que você esteja armazenando o carrinho no localStorage
  const carrinhoJSON = localStorage.getItem('carrinho');
  if (carrinhoJSON) {
    const carrinho = JSON.parse(carrinhoJSON);
    return carrinho.map(item => ({
      nome: item.nome,
      descricao: item.descricao || '',
      preco: item.preco,
      quantidade: item.quantidade
    }));
  }
  return [];
}

function irParaPagamento() {
  window.location.href = "pagamento.html";
}

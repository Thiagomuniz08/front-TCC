const API_URL = "https://back-tcc.vercel.app";

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
      <td>${formatarPreco(subtotal)}</td>
      <td>
        <button class="btn-remover" onclick="removerProduto(${idx})">
          <img src="assets/img/lixo-icon.png" alt="Remover">
        </button>
      </td>
    `;
    tabela.appendChild(tr);
  });

  totalGeral.textContent = formatarPreco(total);
}

window.alterarQtd = function (idx, delta) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho[idx].quantidade += delta;
  if (carrinho[idx].quantidade < 1) carrinho[idx].quantidade = 1;
  if (carrinho[idx].quantidade > 25) carrinho[idx].quantidade = 25;
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTabelaCarrinho();
};

window.removerProduto = function (idx) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(idx, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTabelaCarrinho();
};

function obterCarrinho() {
  const carrinhoJSON = localStorage.getItem("carrinho");
  return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

async function finalizarPedido() {
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para finalizar a compra.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itens: carrinho,
        metodoPagamento: "PIX" // ou "BOLETO", "CREDIT_CARD"
      }),
    });

    const data = await response.json();
    console.log("📦 Resposta do backend:", data);

    if (!response.ok) {
      alert(data.message || "Erro ao criar pedido.");
      return;
    }

    // PIX
    if (data.pixQrCode || data.pixCopiaCola) {
      localStorage.setItem("pixPagamento", JSON.stringify(data));
      window.location.href = "pagamento.html";
      return;
    }

    // Link de boleto ou cartão
    if (data.linkPagamento) {
      window.location.href = data.linkPagamento;
      return;
    }

    alert("Pedido criado com sucesso! Aguarde o pagamento.");
  } catch (err) {
    console.error("Erro ao finalizar pedido:", err);
    alert("Erro ao finalizar pedido. Tente novamente.");
  }
}

window.irParaPagamento = finalizarPedido;
document.addEventListener("DOMContentLoaded", atualizarTabelaCarrinho);
const API_URL = "https://back-tcc.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
  /* === Mostrar/Ocultar senha === */
  function setupToggleSenha(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    let mostrando = false;
    toggle.addEventListener('click', () => {
      mostrando = !mostrando;
      input.type = mostrando ? 'text' : 'password';
    });
  }
  setupToggleSenha('senhaCadastro', 'toggleSenhaCadastro');
  setupToggleSenha('senhaLogin', 'toggleSenhaLogin');

  /* === LOGIN === */
  const formLogin = document.querySelector('#formLogin');
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = { email: formLogin.email.value, senha: formLogin.senha.value };

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login bem-sucedido!');
        window.location.href = "index.html";
      } else {
        alert(data.message || 'Email ou senha inválidos.');
      }
    } catch {
      alert('Erro ao fazer login.');
    }
  });

  /* === CADASTRO === */
  document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = e.target.nome.value;
    const email = e.target.email.value;
    const telefone = e.target.telefone.value;
    const senha = e.target.senha.value;

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        container.classList.remove("right-panel-active");
      } else {
        alert(data.message || "Erro ao cadastrar.");
      }
    } catch {
      alert("Erro ao cadastrar.");
    }
  });

  /* === Alternar entre login/cadastro === */
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");

  signUpButton.addEventListener("click", () => container.classList.add("right-panel-active"));
  signInButton.addEventListener("click", () => container.classList.remove("right-panel-active"));

  /* === Recuperar senha === */
  const esqueceuSenha = document.getElementById("esqueceuSenha");
  const modalRecuperarSenha = document.getElementById("modalRecuperarSenha");
  const fecharModalRecuperar = document.getElementById("fecharModalRecuperar");
  const formRecuperarSenha = document.getElementById("formRecuperarSenha");

  esqueceuSenha.addEventListener("click", (e) => {
    e.preventDefault();
    modalRecuperarSenha.style.display = "flex";
  });
  fecharModalRecuperar.addEventListener("click", () => modalRecuperarSenha.style.display = "none");
  modalRecuperarSenha.addEventListener("click", (e) => {
    if (e.target === modalRecuperarSenha) modalRecuperarSenha.style.display = "none";
  });

  formRecuperarSenha.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = formRecuperarSenha.emailRecuperacao.value.trim();
    if (!email) {
      alert("Por favor, insira seu email.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Se o email estiver cadastrado, você receberá um link.');
        modalRecuperarSenha.style.display = 'none';
        formRecuperarSenha.reset();
      } else {
        alert(data.error || 'Erro ao solicitar recuperação.');
      }
    } catch {
      alert('Erro ao solicitar recuperação.');
    }
  });
});

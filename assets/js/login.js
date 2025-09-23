const uri = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // === MOSTRAR/OCULTAR SENHA ===
    function setupToggleSenha(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        let mostrando = false;
        const iconeAberto = 'https://img.icons8.com/?size=100&id=60022&format=png&color=000000';
        const iconeFechado = 'https://img.icons8.com/?size=100&id=100236&format=png&color=000000';
        toggle.addEventListener('click', () => {
            mostrando = !mostrando;
            input.type = mostrando ? 'text' : 'password';
            toggle.src = mostrando ? iconeFechado : iconeAberto;
            toggle.alt = mostrando ? 'Ocultar senha' : 'Mostrar senha';
        });
    }
    setupToggleSenha('senhaCadastro', 'toggleSenhaCadastro');
    setupToggleSenha('senhaLogin', 'toggleSenhaLogin');
    // === LOGIN ===
    const formLogin = document.querySelector('#formLogin');
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = {
            email: formLogin.email.value,
            senha: formLogin.senha.value,
        };
        try {
            const response = await fetch(`${uri}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login bem-sucedido!');
                window.location.href = '../index.html';
            } else {
                alert(data.message || 'Email ou senha inválidos.');
            }
        } catch {
            alert('Erro ao fazer login.');
        }
    });

    // === CADASTRO ===
    document.getElementById("formCadastro").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = e.target.nome.value;
        const email = e.target.email.value;
        const telefone = e.target.telefone.value;
        const senha = e.target.senha.value;

        try {
            const response = await fetch(`${uri}/usuarios`, {
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
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            alert("Erro ao cadastrar.");
        }
    });

    // === TROCA ENTRE LOGIN E CADASTRO ===
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => container.classList.add("right-panel-active"));
    signInButton.addEventListener("click", () => container.classList.remove("right-panel-active"));

    // === RECUPERAR SENHA ===
    const esqueceuSenha = document.getElementById("esqueceuSenha");
    const modalRecuperarSenha = document.getElementById("modalRecuperarSenha");
    const fecharModalRecuperar = document.getElementById("fecharModalRecuperar");
    const formRecuperarSenha = document.getElementById("formRecuperarSenha");

    esqueceuSenha.addEventListener("click", (e) => {
        e.preventDefault();
        modalRecuperarSenha.style.display = "flex";
    });

    fecharModalRecuperar.addEventListener("click", () => {
        modalRecuperarSenha.style.display = "none";
    });

    modalRecuperarSenha.addEventListener("click", (e) => {
        if (e.target === modalRecuperarSenha) {
            modalRecuperarSenha.style.display = "none";
        }
    });

    formRecuperarSenha.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = formRecuperarSenha.emailRecuperacao.value.trim();

        if (!email) {
            alert("Por favor, insira seu email.");
            return;
        }

        try {
            const response = await fetch(`${uri}/recuperar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.');
                modalRecuperarSenha.style.display = 'none';
                formRecuperarSenha.reset();
            } else {
                alert(data.error || 'Erro ao solicitar recuperação.');
            }
        } catch (err) {
            alert('Erro ao solicitar recuperação.');
        }
    });
});

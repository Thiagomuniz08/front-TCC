  const form = document.querySelector('.agendamento-form');
  const mensagem = document.getElementById('mensagem-sucesso');

  const feriados = [
    '2025-01-01', '2025-04-21', '2025-05-01', '2025-09-07',
    '2025-10-12', '2025-11-02', '2025-11-15', '2025-12-25'
  ];

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    // VALIDAÇÕES
    if (!data || !hora) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (hora < "08:00" || hora > "18:00") {
      alert("Horário permitido é entre 08:00 e 18:00.");
      return;
    }

    // Só permite agendamento em horários de 30 em 30 minutos
    const minutos = parseInt(hora.split(":")[1]);
    if (minutos !== 0 && minutos !== 30) {
      alert("Só é permitido agendar em horários de 30 em 30 minutos.");
      return;
    }

    const dataHoraSelecionada = new Date(`${data}T${hora}`);
    const agora = new Date();

    if (isNaN(dataHoraSelecionada.getTime())) {
      alert("Data ou hora inválida.");
      return;
    }

    if (dataHoraSelecionada <= agora) {
      alert("Você não pode agendar para o passado.");
      return;
    }

    if (dataHoraSelecionada.getFullYear() !== 2025) {
      alert("Somente agendamentos dentro do ano de 2025 são permitidos.");
      return;
    }

    if (dataHoraSelecionada.getDay() === 0) {
      alert("Agendamentos não são permitidos aos domingos.");
      return;
    }

    if (feriados.includes(data)) {
      alert("Agendamentos não são permitidos em feriados.");
      return;
    }

    // PEGA DADOS DO SERVIÇO SELECIONADO
    const agendamentoServico = JSON.parse(localStorage.getItem("servicoSelecionado"));
    if (!agendamentoServico) {
      alert("Serviço não encontrado. Por favor, volte e selecione um serviço.");
      return;
    }

    const agendadoEm = agora.toLocaleString('pt-BR');

    // Armazena o agendamento
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push({
      servico: agendamentoServico.nome,
      data,
      hora,
      agendadoEm
    });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Envia como item para o "carrinho de checkout"
    const checkoutItem = {
      id: agendamentoServico.id,
      nome: agendamentoServico.nome,
      preco: agendamentoServico.preco,
      imagem: agendamentoServico.imagem,
      quantidade: 1,
      data: data,
      hora: hora
    };

    localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));

    // Redireciona para a tela de checkout
    mensagem.style.display = 'block';
    form.reset();

    setTimeout(() => {
      mensagem.style.display = 'none';
      window.location.href = 'checkout.html';
    }, 2000);
  });

  // Define data mínima
  window.addEventListener('DOMContentLoaded', () => {
    const inputData = document.getElementById('data');
    const hoje = new Date().toISOString().split('T')[0];
    inputData.min = hoje;

    // Mostrar imagem e nome do serviço selecionado (se tiver)
    const agendamentoServico = JSON.parse(localStorage.getItem("servicoSelecionado"));
    if (agendamentoServico) {
      const container = document.querySelector('.agendamento-container');
      const img = document.createElement('img');
      const h3 = document.createElement('h3');

      img.src = agendamentoServico.imagem;
      img.alt = agendamentoServico.nome;
      img.style.width = "200px";
      img.style.borderRadius = "10px";
      img.style.marginBottom = "10px";

      h3.textContent = agendamentoServico.nome;                                                                                      
      h3.style.textAlign = "center";
      h3.style.marginTop = "10px";

      container.insertBefore(img, form);
      container.insertBefore(h3, form);
    }
  });
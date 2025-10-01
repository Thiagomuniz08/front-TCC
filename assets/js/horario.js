form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  // VALIDAÇÕES (mantidas iguais)
  if (!data || !hora) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (hora < "08:00" || hora > "18:00") {
    alert("Horário permitido é entre 08:00 e 18:00.");
    return;
  }

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

  try {
    // Envia o agendamento para o backend
    const response = await fetch('https://back-tcc.vercel.app/Agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        produto_id: agendamentoServico.id,
        data: data,
        hora: hora
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar agendamento');
    }

    // Se sucesso, mostra mensagem e redireciona
    mensagem.style.display = 'block';
    form.reset();

    // Opcional: salvar no localStorage para checkout, se necessário
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

    setTimeout(() => {
      mensagem.style.display = 'none';
      window.location.href = 'checkout.html';
    }, 2000);

  } catch (error) {
    alert(`Erro ao agendar: ${error.message}`);
    console.error(error);
  }
});
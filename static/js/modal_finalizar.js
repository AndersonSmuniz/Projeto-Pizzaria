document.querySelector('.btn-finalizar').addEventListener('click', function() {
  abrirModalFinalizar();
});

// Função para abrir o modal de finalização
function abrirModalFinalizar() {
  const modalFinalizar = document.getElementById("modal-finalizar");
  modalFinalizar.style.display = "block";
}

// Função para fechar o modal de finalização
function fecharModalFinalizar() {
  const modalFinalizar = document.getElementById("modal-finalizar");
  modalFinalizar.style.display = "none";
}

// Função para finalizar o pedido
function finalizarPedido() {
  const pagamentoSelecionado = document.querySelector('input[name="payment"]:checked').value;
  const trocoValor = parseFloat(document.getElementById("troco-valor").value);
  const totalPedido = parseFloat(document.getElementById('total').textContent.replace('R$ ', ''));

//Nova função validar o pedido
  if (pagamentoSelecionado === 'dinheiro' && trocoValor < totalPedido) {
    const cardElement = document.querySelector('#modal-finalizar .card');

    // Verifica se a mensagem de erro já existe
    if (cardElement.querySelector('.error-message')) {
      return;
    }

    cardElement.classList.add("modal-error");

    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'O valor do Troco é menor que o total do pedido.';
    cardElement.appendChild(errorMessage);

    return;
  }

  const formData = new FormData();
  formData.append('tipo_pagamento', pagamentoSelecionado);
  formData.append('troco', trocoValor);

  fetch('/finalizar_compra', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {

    exibirMensagemSucesso();
    setTimeout(() => {
      location.reload();
    }, 1000); // Recarrega a página após 1 segundo
  })
  .catch(error => {
    console.error('Erro ao finalizar pedido:', error);
  });
}

function exibirMensagemSucesso() {
  const modalSuccess = document.getElementById('modal-success');
  modalSuccess.style.display = 'block';

  setTimeout(() => {
    modalSuccess.style.display = 'none';
  }, 1000); // Remove a mensagem após 1 segundo
}
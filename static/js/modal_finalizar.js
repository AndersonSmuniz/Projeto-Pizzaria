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
  const trocoValor = document.getElementById("troco-valor").value;

  // Cria um objeto FormData para enviar os dados do pedido
  const formData = new FormData();
  formData.append('tipo_pagamento', pagamentoSelecionado);
  formData.append('troco', trocoValor);

  // Envia uma requisição POST para o endpoint '/finalizar_compra' com os dados do pedido
  fetch('/finalizar_compra', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // Exibe a resposta do backend (Flask) no console

    // Aqui você pode implementar a lógica para lidar com a resposta do backend, por exemplo, exibir uma mensagem de sucesso ao usuário

    // Atualiza a página para refletir os pedidos finalizados
    location.reload();
  })
  .catch(error => {
    console.error('Erro ao finalizar pedido:', error);
  });
}
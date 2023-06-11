// Função para enviar uma requisição para deletar o pedido
function deletePedido(pedidoId) {
  // Cria um objeto FormData para enviar os dados do pedido
  const formData = new FormData();
  formData.append('pedido_id', pedidoId);

  // Envia uma requisição POST para o endpoint '/deletar_pedido' com os dados do pedido
  fetch('/deletar_pedido', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      // Define a variável de sessão 'pedido_deletado' como true
      window.sessionStorage.setItem('pedido_deletado', 'true');
      // Recarrega a página após 1 segundo
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      throw new Error('Erro ao deletar pedido');
    }
  })
  .catch(error => {
    console.error('Erro ao deletar pedido:', error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Função para atualizar o total
  function updateTotal() {
    // Obtém todos os elementos com a classe 'cat_product_subtotal'
    const subtotals = document.querySelectorAll('.cat_product_subtotal p');

    // Inicializa o total como zero
    let total = 0;

    // Itera sobre os elementos de subtotal e adiciona os valores ao total
    subtotals.forEach(subtotalElement => {
      const subtotal = parseFloat(subtotalElement.textContent);
      total += subtotal;
    });

    // Atualiza o elemento de exibição do total
    const totalElement = document.getElementById('total');
    totalElement.textContent = 'R$ ' + total.toFixed(2); // Formata o total com 2 casas decimais
  }

  // Chama a função para atualizar o total
  updateTotal();
});

// Evento de mudança na opção de pagamento
document.querySelectorAll('input[name="payment"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    if (this.value === 'dinheiro') {
      document.querySelector('.money-options').style.display = 'block';
    } else {
      document.querySelector('.money-options').style.display = 'none';
    }
  });
});

const pedidoDeletado = window.sessionStorage.getItem('pedido_deletado');
if (pedidoDeletado === 'true') {
  // Remove a variável de sessão 'pedido_deletado'
  window.sessionStorage.removeItem('pedido_deletado');
  // Atualiza a página após 1 segundo
  setTimeout(() => {
    location.reload();
  }, 1000);
}

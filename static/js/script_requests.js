
// Abre a modal ao clicar no botão "Finalizar Pedido"
var openModalButton = document.querySelector('.cart_action_buy');
openModalButton.addEventListener('click', function() {
  var modal = document.getElementById('modal');
  modal.style.display = 'block';
});

// Fecha a modal ao clicar fora dela ou no botão "Fechar" (x)
var modal = document.getElementById('modal');
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

var closeModalButton = document.querySelector('.close');
closeModalButton.addEventListener('click', function() {
  closeModal();
});


// Função auxiliar para fechar a modal
function closeModal() {
  modal.style.display = 'none';
  var trocoOption = document.getElementById('troco-option');
  trocoOption.style.display = 'none';
}

// Exibe ou esconde a opção de troco dependendo do tipo de pagamento selecionado
var paymentTypeSelect = document.getElementById('payment-type');
var trocoOption = document.getElementById('troco-option');
paymentTypeSelect.addEventListener('change', function() {
  if (paymentTypeSelect.value === 'dinheiro') {
    trocoOption.style.display = 'block';
  } else {
    trocoOption.style.display = 'none';
  }
});

// Ao clicar em "Confirmar Pedido"
var confirmOrderButton = document.getElementById('confirm-order');
confirmOrderButton.addEventListener('click', function() {
  // Remova a label após confirmar o pedido
  var quantityLabel = document.querySelector('.quantity-container label');
  quantityLabel.style.display = 'none';

  // exibir uma animação de pizza sendo preparada)
  // ...

  // Simulando um tempo de espera antes de fechar a modal
  setTimeout(function() {
    closeModal();
  }, 2000); // 3 segundos
});


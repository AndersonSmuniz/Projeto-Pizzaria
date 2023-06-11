const priceInputs = document.querySelectorAll('input[name="size"]');
const productForm = document.getElementById('order-form');
const product_idInput = document.getElementById('product_id');
const itemInput = document.getElementById('item');
const actionInput = document.getElementById('action');
const observationInput = document.getElementById('observation'); // Novo campo oculto

// Adicionar evento de clique aos inputs de preço
priceInputs.forEach(input => {
  input.addEventListener('change', () => {
    const selectedSize = input.value;
    actionInput.value = selectedSize;
  });
});

function openModal(product) {
  const modal = document.getElementById("editModal");
  const pizzaImage = modal.querySelector(".pizza-image");
  const pizzaName = modal.querySelector(".pizza-name");
  const pizzaDescription = modal.querySelector(".pizza-description");

  pizzaImage.src = product.image;
  pizzaName.textContent = product.name;
  pizzaDescription.textContent = product.description;

  const prices = JSON.parse(product.price);
  const priceP = document.getElementById("price_p");
  const priceM = document.getElementById("price_m");
  const priceG = document.getElementById("price_g");

  priceP.textContent = "R$ " + prices[0].P.toFixed(2);
  priceM.textContent = "R$ " + prices[0].M.toFixed(2);
  priceG.textContent = "R$ " + prices[0].G.toFixed(2);

  product_idInput.value = product.id;
  itemInput.value = product.item;

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("editModal");
  const quantityInput = document.getElementById("quantity");
  const quantityValue = quantityInput.value; // Obter o valor atual do campo

  modal.style.display = "none";

  setTimeout(() => {
    // Limpar o campo tempo (100ms)
    quantityInput.value = 1;
  }, 100);
}

function initModal() {
  const buyButton = document.querySelector('.buy');
  const closeButton = document.querySelector('.close');

  buyButton.addEventListener('click', function() {
    const selectedSize = document.querySelector('input[name="size"]:checked').value;
    actionInput.value = selectedSize;
    observationInput.value = document.getElementById("observation").value;
    closeModal();
  });

  closeButton.addEventListener('click', closeModal);

  observationInput.addEventListener('input', function() {
    observationInput.value = this.value;
  });
}

window.addEventListener("DOMContentLoaded", initModal);

productForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(productForm);
  const request = new XMLHttpRequest();

  request.open('POST', '/cardapio');
  request.send(formData);

  closeModal();
});

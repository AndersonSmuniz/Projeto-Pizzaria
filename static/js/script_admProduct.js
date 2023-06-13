var productContainer = document.querySelector('.product-list');

// Criação dos elementos HTML para cada produto
backendProducts.forEach(product => {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  const productImage = document.createElement('div');
  productImage.classList.add('product-image');
  productImage.style.backgroundImage = `url(${product.image})`;

  const userIdInput = document.createElement('input');
  userIdInput.type = 'hidden';
  userIdInput.id = 'user-id';
  userIdInput.value = product.id;

  const productDetails = document.createElement('div');
  productDetails.classList.add('product-details');

  const productName = document.createElement('h3');
  productName.classList.add('product-name');
  productName.textContent = product.name;

  const productDescription = document.createElement('p');
  productDescription.textContent = product.description;

  const productPrice = document.createElement('div');
  productPrice.classList.add('product-price');

  const priceP = document.createElement('span');
  priceP.textContent = `P: R$ ${product.price[0].P.toFixed(2)}`;

  const priceM = document.createElement('span');
  priceM.textContent = `M: R$ ${product.price[0].M.toFixed(2)}`;

  const priceG = document.createElement('span');
  priceG.textContent = `G: R$ ${product.price[0].G.toFixed(2)}`;

  const productActions = document.createElement('div');
  productActions.classList.add('product-actions');

  const editButton = document.createElement('button');
  editButton.classList.add('action-btn', 'edit-btn');
  editButton.setAttribute('onclick', `openEditModal(${product.id})`);
  editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('action-btn', 'delete-btn');
  deleteButton.setAttribute('onclick', `deleteProduct(${product.id})`);
  deleteButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';

  productCard.appendChild(productImage);
  productCard.appendChild(userIdInput);
  productCard.appendChild(productDetails);
  productDetails.appendChild(productName);
  productDetails.appendChild(productDescription);
  productDetails.appendChild(productPrice);
  productPrice.appendChild(priceP);
  productPrice.appendChild(priceM);
  productPrice.appendChild(priceG);
  productDetails.appendChild(productActions);
  productActions.appendChild(editButton);
  productActions.appendChild(deleteButton);

  productContainer.appendChild(productCard);
});

// Função para adicionar um novo produto
function addProduct() {
  // Limpa os campos do formulário
  document.getElementById('user-id').value = '';
  document.getElementById('edit-pizza-name').value = '';
  document.getElementById('edit-pizza-description').value = '';
  document.getElementById('edit-pizza-price-p').value = '';
  document.getElementById('edit-pizza-price-m').value = '';
  document.getElementById('edit-pizza-price-g').value = '';
  document.getElementById('edit-pizza-image').value = '';

  // Limpa a imagem do produto
  const imageElement = document.getElementById('edit-pizza-image');
  imageElement.src = '';

  // Abre o modal de adição
  const modal = document.querySelector('.modal-overlay');
  modal.style.display = 'flex';
}

// Event listener para o botão de adicionar produto
document.querySelector('.add-product').addEventListener('click', function () {
  addProduct();
});

function openEditModal(id) {
  // Encontra o produto com base no ID
  const productToEdit = backendProducts.find(item => item.id === id.toString());

  if (productToEdit) {
    // Preenche os campos do formulário com os dados do produto
    document.getElementById('user-id').value = id;
    document.getElementById('edit-pizza-name').value = productToEdit.name;
    document.getElementById('edit-pizza-description').value = productToEdit.description;
    document.getElementById('edit-pizza-price-p').value = productToEdit.price[0].P;
    document.getElementById('edit-pizza-price-m').value = productToEdit.price[0].M;
    document.getElementById('edit-pizza-price-g').value = productToEdit.price[0].G;
    document.getElementById('edit-pizza-image').value = productToEdit.image;

    // Abre o modal de edição
    const modal = document.querySelector('.modal-overlay');
    modal.style.display = 'flex';
  } else {
    console.error('Produto não encontrado');
  }
}

// Função para excluir um produto
function deleteProduct(id) {
  // Confirmação do usuário para excluir o produto
  if (confirm('Tem certeza de que deseja excluir este produto?')) {
    fetch('/api/produtos/excluir', {
      method: 'POST',
      body: new URLSearchParams({ id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        } else {
          console.error('Erro ao excluir o produto:', data.error);
        }
      })
      .catch(error => {
        console.error('Erro ao excluir o produto:', error);
      });
  }
}

// Função para fechar o modal de edição
function closeEditModal() {
  const modal = document.querySelector('.modal-overlay');
  modal.style.display = 'none';
}

// Função para atualizar um produto
function updateProduct(event) {
  event.preventDefault();

  // Obtém os valores dos campos do formulário
  const id = document.getElementById('user-id').value;
  const name = document.getElementById('edit-pizza-name').value;
  const description = document.getElementById('edit-pizza-description').value;
  const price_p = document.getElementById('edit-pizza-price-p').value;
  const price_m = document.getElementById('edit-pizza-price-m').value;
  const price_g = document.getElementById('edit-pizza-price-g').value;
  const image = document.getElementById('edit-pizza-image').value;

  // Envia a solicitação de atualização para a rota correspondente
  fetch('/adm/produtos/atualizar-adicionar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, name, description, price_p, price_m, price_g, image }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Atualiza a página
        location.reload();
      } else {
        console.error('Erro ao atualizar o produto:', data.error);
      }
    })
    .catch(error => {
      console.error('Erro ao atualizar o produto:', error);
    });

  // Fecha o modal de edição
  closeEditModal();
}

document.querySelector('.cancel-btn').addEventListener('click', function () {
  closeEditModal();
});

document.querySelector('.save-btn').addEventListener('click', function (event) {
  event.preventDefault();
  updateProduct(event);
});

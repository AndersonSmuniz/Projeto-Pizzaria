// Seleciona os elementos do menu
var menuItems = document.querySelectorAll('.menu_items .category');

// Adiciona um listener de clique a cada item do menu
menuItems.forEach(function(menuItem) {
  menuItem.addEventListener('click', function() {
    // Remove a classe 'active' de todos os itens do menu
    menuItems.forEach(function(item) {
      item.classList.remove('active');
    });

    // Adiciona a classe 'active' ao item de menu clicado
    this.classList.add('active');

    // Atualize a exibição de acordo com a categoria selecionada
    var categoryName = this.textContent.trim();
    updateDisplay(categoryName);
  });
});

// Função para atualizar a exibição de acordo com a categoria selecionada
function updateDisplay(categoryName) {
  // Oculta todos os itens do cardápio
  var menuItems = document.querySelectorAll('.menu_item');
  menuItems.forEach(function(item) {
    item.style.display = 'none';
  });

  // Exibe apenas os itens da categoria selecionada
  var itemsToShow = document.querySelectorAll('.menu_item[data-category="' + categoryName + '"]');
  itemsToShow.forEach(function(item) {
    item.style.display = 'block';
  });
}

///carrinho
// Variáveis globais
const cartButton = document.querySelector('.cart');
const cartCount = document.querySelector('.cart-count');
const buyButton = document.querySelector('.buy');

// Evento de clique no botão "Comprar"
buyButton.addEventListener('click', function() {
  addToCart();
});
// Animação do botão "Comprar"
buyButton.addEventListener('mouseover', function() {
  const tooltip = document.createElement('span');
  tooltip.textContent = 'Colocar no carrinho';
  tooltip.classList.add('tooltip');
  buyButton.appendChild(tooltip);
});

// Evento de sair o mouse do botão "Comprar"

buyButton.addEventListener('mouseout', function() {
  const tooltip = buyButton.querySelector('.tooltip');
  if (tooltip) {
    buyButton.removeChild(tooltip);
  }
});

// Função para adicionar ao carrinho
function addToCart() {
  // Atualizar o número de itens no carrinho
  const count = parseInt(cartCount.textContent);
  cartCount.textContent = count + 1;

  // Exibir o carrinho
  cartButton.classList.add('show-cart');
}

// Evento de clique no carrinho para redirecionar para a página do carrinho
cartButton.addEventListener('click', function() {
  window.location.href = '/carrinho';
});


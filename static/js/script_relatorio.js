// Função para adicionar um evento a todas as linhas da tabela
document.addEventListener('DOMContentLoaded', function() {
  var rows = document.querySelectorAll('tbody tr');
  for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function() {
      // Remove a classe de cor
      var allRows = document.querySelectorAll('tbody tr');
      for (var j = 0; j < allRows.length; j++) {
        allRows[j].classList.remove('selected-row');
      }

      this.classList.add('selected-row');

      console.log('Clique na linha:', this);
    });
  }
});

document.addEventListener('click', (e) => {
  const dropdown = e.target.classList.contains('dropdown');

  if (!dropdown && e.target.closest('.navbar__item') != null) return;
    
  let submenu

  if (dropdown) {
    const item = e.target.closest('.navbar__item')

    submenu = item.querySelector('.dropdown_content')
    
    submenu.classList.toggle('active');
}
  document.querySelectorAll('.dropdown_content.active').forEach(dropdownContent => {
    if (dropdownContent === submenu) return;
  
    dropdownContent.classList.remove('active');
  })
});




document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const resourceCards = document.querySelectorAll('.resource-card');
  const noResults = document.querySelector('.no-results');

  if (!filterButtons.length || !resourceCards.length || !noResults) {
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');

      filterButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');

      let visibleCount = 0;
      resourceCards.forEach((card) => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = '';
          card.classList.add('fade-in');
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });
});

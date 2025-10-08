const searchCatalog = [
  {
    id: 'aurora-lamp',
    name: 'Lampe Aurora',
    price: 89.9,
    category: 'home',
    tags: ['lumière', 'ambiance', 'smart home'],
    description: "Un éclairage intelligent avec scénarios automatiques et compatibilité assistants vocaux.",
  },
  {
    id: 'serenity-headphones',
    name: 'Casque Serenity',
    price: 129,
    category: 'tech',
    tags: ['audio', 'bluetooth', 'concentration'],
    description: "Casque circum-aural à réduction de bruit adaptative avec 36 h d'autonomie.",
  },
  {
    id: 'pulse-tracker',
    name: 'Bracelet Pulse',
    price: 59.5,
    category: 'wellness',
    tags: ['sport', 'santé', 'sommeil'],
    description: 'Suivi de santé complet, analyse du sommeil et défis sportifs en équipe.',
  },
  {
    id: 'nomad-backpack',
    name: 'Sac à dos Nomad',
    price: 149,
    category: 'mobility',
    tags: ['voyage', 'ordinateur', 'recyclé'],
    description: 'Sac modulable waterproof avec poche sécurisée RFID et batterie externe intégrée.',
  },
  {
    id: 'velvet-throw',
    name: 'Plaid Velvet',
    price: 74.25,
    category: 'home',
    tags: ['cocon', 'décoration', 'douceur'],
    description: 'Plaid épais double face, fibres recyclées et finition velours lavable.',
  },
  {
    id: 'artisan-mug',
    name: 'Set mugs Atelier',
    price: 39.9,
    category: 'home',
    tags: ['café', 'artisanat', 'céramique'],
    description: 'Lot de 4 mugs faits main, émaillage bicolore et compatibilité lave-vaisselle.',
  },
];

const priceFilters = {
  '0-50': (price) => price < 50,
  '50-100': (price) => price >= 50 && price <= 100,
  '100-200': (price) => price > 100 && price <= 200,
  '200+': (price) => price > 200,
};

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const categorySelect = document.querySelector('[data-search-category]');
  const priceSelect = document.querySelector('[data-search-price]');
  const resultsContainer = document.querySelector('[data-search-results]');
  const countElement = document.querySelector('[data-search-count]');

  if (!form || !resultsContainer) {
    return;
  }

  function renderResults(items) {
    resultsContainer.innerHTML = '';
    if (countElement) {
      countElement.textContent = items.length;
    }

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Aucun produit ne correspond à ces critères pour le moment.';
      resultsContainer.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'product-card';
      article.innerHTML = `
        <div class="product-card__image">${item.name}</div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="product-card__footer">
          <span class="price-tag">${formatPrice(item.price)}</span>
          <button
            class="btn btn-primary"
            data-add-to-cart
            data-product-id="${item.id}"
            data-product-name="${item.name}"
            data-product-price="${item.price}"
          >
            Ajouter au panier
          </button>
        </div>
      `;
      fragment.appendChild(article);
    });

    resultsContainer.appendChild(fragment);
  }

  function filterCatalog(event) {
    if (event) {
      event.preventDefault();
    }

    const keyword = input ? input.value.trim().toLowerCase() : '';
    const category = categorySelect ? categorySelect.value : 'all';
    const price = priceSelect ? priceSelect.value : 'all';

    const filtered = searchCatalog.filter((product) => {
      const matchesKeyword = keyword
        ? product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          product.tags.some((tag) => tag.toLowerCase().includes(keyword))
        : true;
      const matchesCategory = category === 'all' ? true : product.category === category;
      const matchesPrice = price === 'all' ? true : priceFilters[price]?.(product.price) ?? true;
      return matchesKeyword && matchesCategory && matchesPrice;
    });

    renderResults(filtered);
  }

  form.addEventListener('submit', filterCatalog);
  form.addEventListener('input', (event) => {
    if (['INPUT', 'SELECT'].includes(event.target.tagName)) {
      filterCatalog();
    }
  });

  renderResults(searchCatalog);
});

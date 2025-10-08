(function () {
  const STORAGE_KEY = 'nova-boutique-cart';
  const currencyFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });

  function formatPrice(value) {
    return currencyFormatter.format(value);
  }

  function readCart() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((item) => item && typeof item.id === 'string');
    } catch (error) {
      console.warn('Impossible de lire le panier', error);
      return [];
    }
  }

  function persistCart(cart) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.warn('Impossible d\'enregistrer le panier', error);
    }
    document.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: { cart },
      })
    );
  }

  const Cart = {
    getItems() {
      return readCart();
    },

    save(items) {
      persistCart(items);
    },

    add(product) {
      const items = readCart();
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          quantity: 1,
        });
      }
      persistCart(items);
    },

    remove(id) {
      const items = readCart().filter((item) => item.id !== id);
      persistCart(items);
    },

    updateQuantity(id, quantity) {
      const items = readCart();
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      target.quantity = Math.max(1, quantity);
      persistCart(items);
    },

    increase(id) {
      const items = readCart();
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      target.quantity += 1;
      persistCart(items);
    },

    decrease(id) {
      const items = readCart();
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      target.quantity -= 1;
      if (target.quantity <= 0) {
        const filtered = items.filter((item) => item.id !== id);
        persistCart(filtered);
      } else {
        persistCart(items);
      }
    },

    clear() {
      persistCart([]);
    },

    getCount() {
      return readCart().reduce((total, item) => total + item.quantity, 0);
    },

    getTotal() {
      return readCart().reduce((total, item) => total + item.quantity * item.price, 0);
    },
  };

  function updateCartCount() {
    const count = Cart.getCount();
    const countElements = document.querySelectorAll('[data-cart-count]');
    countElements.forEach((element) => {
      element.textContent = count;
    });
  }

  function renderCartTable() {
    const body = document.querySelector('[data-cart-items]');
    const emptyMessage = document.querySelector('[data-cart-empty]');
    const subtotalElement = document.querySelector('[data-cart-subtotal]');
    const totalElement = document.querySelector('[data-cart-total]');

    if (!body) {
      return;
    }

    const items = Cart.getItems();
    body.innerHTML = '';

    if (items.length === 0) {
      if (emptyMessage) {
        emptyMessage.classList.remove('is-hidden');
      }
      if (subtotalElement) {
        subtotalElement.textContent = formatPrice(0);
      }
      if (totalElement) {
        totalElement.textContent = formatPrice(0);
      }
      return;
    }

    if (emptyMessage) {
      emptyMessage.classList.add('is-hidden');
    }

    items.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${formatPrice(item.price)}</td>
        <td>
          <div class="quantity-controls">
            <button type="button" data-cart-action="decrease" data-product-id="${item.id}" aria-label="Diminuer">
              −
            </button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${item.id}" aria-label="Augmenter">
              +
            </button>
          </div>
        </td>
        <td>${formatPrice(item.price * item.quantity)}</td>
        <td class="text-center">
          <button type="button" class="remove-link" data-cart-action="remove" data-product-id="${item.id}">
            Retirer
          </button>
        </td>
      `;
      body.appendChild(row);
    });

    const total = Cart.getTotal();
    if (subtotalElement) {
      subtotalElement.textContent = formatPrice(total);
    }
    if (totalElement) {
      totalElement.textContent = formatPrice(total);
    }
  }

  function renderCheckoutSummary() {
    const list = document.querySelector('[data-checkout-items]');
    const totalElement = document.querySelector('[data-checkout-total]');
    if (!list) {
      return;
    }

    const items = Cart.getItems();
    list.innerHTML = '';

    if (items.length === 0) {
      const emptyLine = document.createElement('li');
      emptyLine.className = 'text-muted';
      emptyLine.textContent = 'Votre panier est vide.';
      list.appendChild(emptyLine);
    } else {
      items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <span>${item.name} × ${item.quantity}</span>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        `;
        list.appendChild(listItem);
      });
    }

    if (totalElement) {
      totalElement.textContent = formatPrice(Cart.getTotal());
    }
  }

  function handleAddToCartClick(event) {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) {
      return;
    }
    event.preventDefault();
    const { productId, productName, productPrice } = button.dataset;
    if (!productId || !productName) {
      return;
    }
    Cart.add({
      id: productId,
      name: productName,
      price: Number(productPrice) || 0,
    });
    button.classList.add('is-added');
    button.textContent = 'Ajouté !';
    setTimeout(() => {
      button.classList.remove('is-added');
      button.textContent = 'Ajouter au panier';
    }, 1500);
  }

  function handleCartActions(event) {
    const actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) {
      return;
    }
    const { productId } = actionButton.dataset;
    if (!productId) {
      return;
    }
    const action = actionButton.getAttribute('data-cart-action');
    if (action === 'remove') {
      Cart.remove(productId);
    }
    if (action === 'increase') {
      Cart.increase(productId);
    }
    if (action === 'decrease') {
      Cart.decrease(productId);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartTable();
    renderCheckoutSummary();
  });

  document.addEventListener('cart:updated', () => {
    updateCartCount();
    renderCartTable();
    renderCheckoutSummary();
  });

  document.addEventListener('click', handleAddToCartClick);
  document.addEventListener('click', handleCartActions);

  window.NovaCart = {
    add: (product) => Cart.add(product),
    clear: () => Cart.clear(),
    getItems: () => Cart.getItems(),
    getTotal: () => Cart.getTotal(),
    formatPrice,
  };
})();

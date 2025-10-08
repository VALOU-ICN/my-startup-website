(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-checkout-form]');
    const confirmation = document.querySelector('[data-checkout-confirmation]');

    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (typeof window.NovaCart !== 'undefined') {
        window.NovaCart.clear();
      }
      form.reset();
      if (confirmation) {
        confirmation.classList.remove('is-hidden');
        confirmation.focus?.();
      }
    });
  });
})();

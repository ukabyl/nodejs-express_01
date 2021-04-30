const toCurrency = price => new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  }).format(price)


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
  });
  
  document.querySelectorAll('.date').forEach(node => {
    node.textContent = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric'
    }).format(new Date(node.textContent));
  });
  

  const cartContent = document.querySelector('.cart-content');
  let cartContentBody, cartTotalPrice;

  if (cartContent) {
    cartContentBody = cartContent.querySelector('tbody');
    cartTotalPrice = cartContent.querySelector('.total-price');

    cartContent.addEventListener('click', (e) => {
      if (e.target.classList.contains('deleteFromCart')) {
        fetch(`/cart/${e.target.dataset.id}/delete`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(cart => {
            if (cart.courses.length) {
              const tableBody = cart.courses.map(({title, price, count, id}) => {
                return `
                <tr>
                  <td>${title}</td>
                  <td class="price">${price}</td>
                  <td>${count}</td>
                  <td>
                    <button class="uk-button uk-button-danger deleteFromCart" data-id="${id}">Delete</button>
                  </td>
                </tr>`
              }).join('');
    
              cartContentBody.innerHTML = tableBody;
              cartTotalPrice.textContent = toCurrency(cart.price);
            } else {
              cartContent.innerHTML = '<p>Your cart is empty!</p>'
            }
          });
      }
    });
  }
});


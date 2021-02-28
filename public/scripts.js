document.querySelectorAll('.price').forEach(node => {
  node.textContent = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  }).format(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
  node.textContent = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).format(node.textContent);
});
const products = [
  {
    id: 'coca-cola-grande',
    name: 'Coca Cola 3.05 L',
    category: 'Bebida',
    description: 'COLA COCA COLA 3.05 L',
    priceCents: 100,
    badge: 'Popular',
    rating: '4.9',
    image: 'assets/img/cola-grande.webp'
  },
  {
    id: 'coca-cola',
    name: 'Coca Cola 500ML',
    category: 'Bebida',
    description: 'COLA COCA COLA 500 ML',
    priceCents: 300,
    badge: 'Nuevo',
    rating: '4.6',
    image: 'assets/img/cola.webp'
  },
  {
    id: 'chocolate',
    name: 'Barra de Chocolate 100 G',
    category: 'Chocolate',
    description: 'BARRA DE CHOCOLATE NEGRO ES CHOCOLATE PREMIUM 100 G',
    priceCents: 399,
    badge: 'Popular',
    rating: '4.5',
    image: 'assets/img/chocolate.webp'
  },

  {
    id: 'chocolate-blanco ',
    name: 'Chocolate Blanco 80 G',
    category: 'Chocolate',
    description: 'CHOCOLATE GALAK 80 G BLANCO',
    priceCents: 185,
    badge: 'Nuevo',
    rating: '4.7',
    image: 'assets/img/chocolate-blanco.webp'
  },
  {
    id: 'papas',
    name: 'Papas Fritas Natural 136 G',
    category: 'Papas',
    description: 'PAPAS FRITAS RUFFLES 136 G NATURAL',
    priceCents: 180,
    badge: 'Recomendado',
    rating: '4.7',
    image: 'assets/img/papas.webp'
  },
  {
    id: 'papas-picantes', 
    name: 'Papas Fritas Picante 136 G',
    category: 'Papas',
    description: 'PAPAS FRITAS RUFFLES 136 G PICANTE',
    priceCents: 170,
    badge: 'Oferta',
    rating: '5.0',
    image: 'assets/img/papas-picante.webp'
  },
  {
    id: 'galletas-vainilla',
    name: 'Galletas Dulces Vainilla 350 G',
    category: 'Galletas',
    description: 'GALLETAS DULCES APETITAS 380 G VAINILLA',
    priceCents: 180,
    badge: 'Recomendado',
    rating: '4.6',
    image: 'assets/img/galletes-vainilla.webp'
  },
  {
    id: 'galletas-chocolate',
    name: 'Galletas Dulces Chocolate 350 G',
    category: 'Galletas',
    description: 'GALLETAS DULCES APETITAS 350 G CHOCOLATE',
    priceCents: 190,
    badge: 'Oferta',
    rating: '4.8',
    image: 'assets/img/galletes-chocolate.webp'
  }
];

let cart = [];
let payphoneConfig = null;

const productGrid = document.querySelector('#product-grid');
const cartDrawer = document.querySelector('#cart-drawer');
const cartContent = document.querySelector('#cart-content');
const cartCount = document.querySelector('#cart-count');
const checkoutModal = document.querySelector('#checkout-modal');
const checkoutSummary = document.querySelector('#checkout-summary');
const paymentMessage = document.querySelector('#payment-message');
const toast = document.querySelector('#toast');

const currency = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function formatMoney(cents) {
  return currency.format(cents / 100);
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span>${product.category}</span>
          <span>★ ${product.rating}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatMoney(product.priceCents)}</strong>
          <button type="button" data-add-product="${product.id}">Agregar <span>+</span></button>
        </div>
      </div>
    </article>
  `).join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    showToast('Este producto ya está en tu carrito.');
    openCart();
    return;
  }

  cart.push(product);
  updateCart();
  showToast(`${product.name} agregado al carrito.`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function getCartTotal() {
  return cart.reduce((total, product) => total + product.priceCents, 0);
}

function updateCart() {
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <div>🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega un accesorio para iniciar una compra de prueba.</p>
        <button type="button" data-close-cart>Explorar productos</button>
      </div>
    `;
    return;
  }

  cartContent.innerHTML = `
    <div class="cart-items">
      ${cart.map(product => `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <span>${product.category}</span>
            <h3>${product.name}</h3>
            <strong>${formatMoney(product.priceCents)}</strong>
          </div>
          <button type="button" data-remove-product="${product.id}" aria-label="Eliminar ${product.name}">×</button>
        </article>
      `).join('')}
    </div>
    <div class="cart-total">
      <div><span>Subtotal</span><strong>${formatMoney(getCartTotal())}</strong></div>
      <div><span>Envío</span><strong>Gratis</strong></div>
      <div class="grand-total"><span>Total</span><strong>${formatMoney(getCartTotal())}</strong></div>
      <button class="checkout-button" id="start-checkout" type="button">Continuar al pago <span>→</span></button>
      <small>Transacción simulada en ambiente de pruebas.</small>
    </div>
  `;
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  if (!checkoutModal.classList.contains('open')) document.body.classList.remove('no-scroll');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  document.querySelector('#pp-button').innerHTML = '';
}

function createClientTransactionId() {
  return Date.now().toString();
}

async function loadPayphoneConfig() { 
  if (payphoneConfig) return payphoneConfig;

  console.log('[PAYPHONE] Cargando configuración desde /api/payphone-config...');
  const response = await fetch('/api/payphone-config', { cache: 'no-store' });
  console.log('[PAYPHONE] Response status:', response.status, 'Content-Type:', response.headers.get('content-type'));
  
  const rawText = await response.text();
  console.log('[PAYPHONE] Response body:', rawText.substring(0, 300));

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    console.error('[PAYPHONE] ❌ JSON.parse falló:', parseErr.message);
    console.error('[PAYPHONE] Body recibido NO es JSON:', rawText.substring(0, 500));
    throw new Error('La respuesta del servidor no es JSON válido. Body: ' + rawText.substring(0, 200));
  }

  console.log('[PAYPHONE] Config parseada:', { ok: data.ok, hasToken: !!data.token, hasStoreId: !!data.storeId });
  if (!response.ok || !data.ok) throw new Error(data.message || 'No se pudo cargar la configuración de Payphone.');

  payphoneConfig = data;
  return payphoneConfig;
}



function renderCheckoutSummary(transactionId) {
  checkoutSummary.innerHTML = `
    <p class="summary-caption">Resumen del pedido</p>
    <div class="summary-products">
      ${cart.map(product => `
        <div class="summary-product">
          <img src="${product.image}" alt="${product.name}">
          <div><strong>${product.name}</strong><small>${product.category}</small></div>
          <span>${formatMoney(product.priceCents)}</span>
        </div>
      `).join('')}
    </div>
    <div class="summary-lines">
      <div><span>Subtotal</span><strong>${formatMoney(getCartTotal())}</strong></div>
      <div><span>Envío</span><strong>Gratis</strong></div>
      <div class="summary-total"><span>Total a pagar</span><strong>${formatMoney(getCartTotal())}</strong></div>
    </div>
    <div class="transaction-reference">
      <span>Referencia del pedido</span>
      <code>${transactionId}</code>
    </div>
  `;
}

async function startCheckout() {
  if (cart.length === 0) return;
  console.log('[CHECKOUT] Iniciando checkout...');

  closeCart();
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  const transactionId = createClientTransactionId();
  console.log('[CHECKOUT] clientTransactionId:', transactionId);
  renderCheckoutSummary(transactionId);
  const buttonContainer = document.querySelector('#pp-button');
  buttonContainer.innerHTML = '';
  paymentMessage.className = 'notice';
  paymentMessage.textContent = 'Cargando la Cajita de Pagos segura…';

  try {
    console.log('[CHECKOUT] Cargando config de Payphone...');
    const config = await loadPayphoneConfig();
    console.log('[CHECKOUT] Config cargada OK');

    console.log('[CHECKOUT] Verificando SDK PPaymentButtonBox...');
    console.log('[CHECKOUT] window.PPaymentButtonBox:', typeof window.PPaymentButtonBox);
    console.log('[CHECKOUT] PPaymentButtonBox global:', typeof PPaymentButtonBox);
    
    if (typeof window.PPaymentButtonBox !== 'function' && typeof PPaymentButtonBox !== 'function') {
      throw new Error('El SDK de Payphone todavía no está disponible. Recarga la página e inténtalo nuevamente.');
    }

    const PayphoneBox = window.PPaymentButtonBox || PPaymentButtonBox;
    const amount = getCartTotal();
    const reference = "Compra de prueba en JoelStore";
    console.log('[CHECKOUT] Creando PayphoneBox con:', { amount, storeId: config.storeId, transactionId });

    new PayphoneBox({
      token: config.token,
      clientTransactionId: transactionId,
      amount: amount,
      amountWithoutTax: amount,
      currency: 'USD',
      storeId: config.storeId,
      reference,
      lang: 'es',
      defaultMethod: 'card',
      timeZone: -5,
      optionalParameter: 'Proyecto académico JoelStore',
      responseUrl: "http://localhost:3000/response"
    }).render('pp-button');

    console.log('[CHECKOUT] ✅ PayphoneBox renderizado correctamente');
    paymentMessage.className = 'notice success';
    paymentMessage.textContent = 'Formulario cargado. Completa los datos de prueba para continuar.';
  } catch (error) {
    console.error('[CHECKOUT] ❌ Error:', error.message);
    console.error('[CHECKOUT] Stack:', error.stack);
    paymentMessage.className = 'notice error';
    paymentMessage.textContent = error.message;
  }
}

document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add-product]');
  const removeButton = event.target.closest('[data-remove-product]');
  const closeCartButton = event.target.closest('[data-close-cart]');
  const closeCheckoutButton = event.target.closest('[data-close-checkout]');

  if (addButton) addToCart(addButton.dataset.addProduct);
  if (removeButton) removeFromCart(removeButton.dataset.removeProduct);
  if (closeCartButton) closeCart();
  if (closeCheckoutButton) closeCheckout();
  if (event.target.closest('#open-cart')) openCart();
  if (event.target.closest('#start-checkout')) startCheckout();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});

renderProducts();
updateCart();
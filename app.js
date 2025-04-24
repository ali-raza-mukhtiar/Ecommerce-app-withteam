const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cancelSearchBtn = document.getElementById('cancel-search');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function fetchProducts() {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    allProducts = data;
    renderProducts(data);
    updateCartUI(); // Show saved cart if any
}

function renderProducts(products) {
    if (!products.length) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h4>${product.title}</h4>
            <p>$${product.price}</p>
            <button onclick='addToCart(${product.id})'>Add to Cart</button>
        `;
        productsContainer.appendChild(div);
    });
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    if (!cart.length) {
        cartItemsContainer.innerHTML = '<p class="empty">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        cartCount.textContent = '0';
        localStorage.setItem('cart', JSON.stringify(cart));
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>${item.title}</strong></p>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick='removeFromCart(${item.id})'>Remove</button>
            <hr>
        `;
        cartItemsContainer.appendChild(div);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.category-btn.active').classList.remove('active');
        btn.classList.add('active');
        const category = btn.dataset.category;
        const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    });
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
    cancelSearchBtn.style.display = 'inline-block';
});

cancelSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderProducts(allProducts);
    cancelSearchBtn.style.display = 'none';
});

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

fetchProducts();

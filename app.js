// DOM Elements
const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// State
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from FakeStoreAPI
async function fetchProducts() {
    try {
        productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
        
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        
        displayProducts(products);
    } catch (error) {
        productsContainer.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
        console.error('Error:', error);
    }
}

// Display products
function displayProducts(productsToShow) {
    productsContainer.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsContainer.innerHTML = '<div class="empty">No products found.</div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.title} added to cart`);
}

// Update cart UI
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                <p class="remove-item" data-id="${item.id}">Remove</p>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Remove from cart
function removeFromCart(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Search products
function searchProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Event Listeners
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterByCategory(btn.dataset.category);
    });
});

searchBtn.addEventListener('click', searchProducts);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchProducts();
});

cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    showNotification('Checkout functionality would be implemented here');
    // In a real app, you would redirect to checkout page
});

// Initialize
fetchProducts();
updateCart();
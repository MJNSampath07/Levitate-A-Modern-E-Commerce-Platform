document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelector('.cart-items');
    const cartContent = document.querySelector('.cart-content');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total');

    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartContent.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        cartContent.style.display = 'grid';
        emptyCartMessage.style.display = 'none';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `).join('');

        updateSummary();
        attachEventListeners();
    }

    function updateSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 99 : 0;
        const tax = subtotal * 0.18;
        const total = subtotal + shipping + tax;

        subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
        shippingElement.textContent = `₹${shipping.toLocaleString()}`;
        taxElement.textContent = `₹${tax.toLocaleString()}`;
        totalElement.textContent = `₹${total.toLocaleString()}`;
    }

    function attachEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cart = JSON.parse(localStorage.getItem('cart'));
                const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                const itemIndex = cart.findIndex(item => item.id === itemId);
                
                if (e.target.classList.contains('plus')) {
                    cart[itemIndex].quantity++;
                } else if (e.target.classList.contains('minus') && cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cart = JSON.parse(localStorage.getItem('cart'));
                const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                const updatedCart = cart.filter(item => item.id !== itemId);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                updateCart();
                
                // Update cart count in header
                document.querySelector('.cart-count').textContent = updatedCart.length;
            });
        });
    }

    // Initialize cart
    updateCart();

    // Checkout button handler
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            alert('Proceeding to checkout...');
            // Add checkout logic here
        }
    });
}); 
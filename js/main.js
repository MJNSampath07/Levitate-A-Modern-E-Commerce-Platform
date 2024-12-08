document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Initialize cart array in localStorage if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart count on page load
    updateCartCount();

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                id: Date.now(), // Unique ID for each item
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('₹', '').replace(',', '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            // Get current cart and add new item
            const cart = JSON.parse(localStorage.getItem('cart'));
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Animation effect
            button.textContent = 'Added!';
            button.style.backgroundColor = '#00cc6a';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#00ff88';
            }, 1000);

            updateCartCount();
        });
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cartCount.textContent = cart.length;
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset;
        header.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Navigation background change on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        } else {
            nav.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
        }
    });

    // Products page specific functionality
    if (document.querySelector('.products-container')) {
        // Price range filter
        const priceRange = document.querySelector('.price-range');
        const products = document.querySelectorAll('.product-card');
        const currentPriceDisplay = document.createElement('div');
        
        // Add current price display
        currentPriceDisplay.className = 'current-price-display';
        currentPriceDisplay.style.textAlign = 'center';
        currentPriceDisplay.style.marginTop = '10px';
        currentPriceDisplay.style.color = 'var(--primary-color)';
        currentPriceDisplay.style.fontWeight = 'bold';
        priceRange.parentNode.insertBefore(currentPriceDisplay, priceRange.nextSibling);

        // Update price display on range input
        function updatePriceDisplay(value) {
            currentPriceDisplay.textContent = `Selected Price: ₹${Number(value).toLocaleString()}`;
        }

        // Initialize price display
        updatePriceDisplay(priceRange.value);

        // Price range filter with live update
        priceRange?.addEventListener('input', (e) => {
            updatePriceDisplay(e.target.value);
            filterProducts();
        });

        // Category filter
        const categoryCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
        const allCheckbox = document.querySelector('input[value="all"]');

        // Handle "All" checkbox
        allCheckbox.addEventListener('change', (e) => {
            categoryCheckboxes.forEach(checkbox => {
                if (checkbox.value !== 'all') {
                    checkbox.checked = e.target.checked;
                }
            });
            filterProducts();
        });

        // Handle other checkboxes
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.value !== 'all') {
                checkbox.addEventListener('change', () => {
                    const allChecked = Array.from(categoryCheckboxes)
                        .filter(cb => cb.value !== 'all')
                        .every(cb => cb.checked);
                    allCheckbox.checked = allChecked;
                    filterProducts();
                });
            }
        });

        function filterProducts() {
            const checkedCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked && cb.value !== 'all')
                .map(cb => cb.value);

            products.forEach(product => {
                const category = product.getAttribute('data-category');
                const price = parseInt(product.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
                
                const matchesCategory = checkedCategories.includes(category) || allCheckbox.checked;
                const matchesPrice = price <= priceRange.value;

                if (matchesCategory && matchesPrice) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        // Initialize filters
        filterProducts();

        // Create "No Results" message
        function createNoResultsMessage() {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.style.textAlign = 'center';
            message.style.padding = '2rem';
            message.style.gridColumn = '1 / -1';
            message.innerHTML = `
                <i class="fas fa-search" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <p>No products match your current filters.</p>
                <button onclick="resetFilters()" class="reset-filters-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); border: none; border-radius: 5px; cursor: pointer;">Reset Filters</button>
            `;
            document.querySelector('.products-grid').appendChild(message);
            return message;
        }

        // Reset filters function
        window.resetFilters = function() {
            categoryCheckboxes.forEach(cb => cb.checked = true);
            priceRange.value = priceRange.max;
            filterProducts();
        };

        // Add floating animation after entrance animations complete
        setTimeout(() => {
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.add('animated');
            });
        }, 2000); // Wait for entrance animations to complete

        // Add ripple effect on product card click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                let ripple = document.createElement('div');
                ripple.className = 'ripple';
                this.appendChild(ripple);

                let rect = this.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;

                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            });
        });
    }

    // In the existing main.js file, update the cart icon click handler
    document.querySelector('.cart').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}); 
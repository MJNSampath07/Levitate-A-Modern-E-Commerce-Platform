document.addEventListener('DOMContentLoaded', () => {
    // Set the end date for the sale (24 hours from now)
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 24);

    function updateCountdown() {
        const now = new Date();
        const timeDifference = endDate - now;

        if (timeDifference <= 0) {
            // Reset timer to 24 hours when it reaches zero
            endDate.setHours(endDate.getHours() + 24);
            return;
        }

        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // Update the countdown display
        const countdownElement = document.getElementById('countdown-timer');
        countdownElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Add urgency effect when time is running low (less than 1 hour)
        if (hours < 1) {
            countdownElement.style.color = '#ff3366';
            countdownElement.style.animation = 'urgentPulse 1s infinite';
        }
    }

    // Add CSS animation for urgent countdown
    const style = document.createElement('style');
    style.textContent = `
        @keyframes urgentPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Add to cart functionality for sales items
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const saleCard = button.closest('.sale-card');
            const product = {
                id: Date.now(),
                name: saleCard.querySelector('h3').textContent,
                price: parseFloat(saleCard.querySelector('.discounted-price').textContent.replace('₹', '').replace(',', '')),
                image: saleCard.querySelector('img').src,
                quantity: 1
            };

            // Get current cart and add new item
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count in header
            const cartCount = document.querySelector('.cart-count');
            cartCount.textContent = cart.length;

            // Animation effect
            button.textContent = 'Added!';
            button.style.backgroundColor = '#cc2b36';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#EF3340';
            }, 1000);
        });
    });

    // Update countdown every second
    updateCountdown(); // Initial call
    setInterval(updateCountdown, 1000);

    // Add hover effect for countdown
    const countdown = document.querySelector('.countdown');
    countdown.addEventListener('mouseover', () => {
        countdown.style.transform = 'scale(1.1)';
        countdown.style.transition = 'transform 0.3s ease';
    });
    countdown.addEventListener('mouseout', () => {
        countdown.style.transform = 'scale(1)';
    });

    // Add stock update functionality
    const stockBars = document.querySelectorAll('.stock-bar');
    stockBars.forEach(bar => {
        const stockLevel = parseInt(bar.style.getPropertyValue('--stock-level'));
        if (stockLevel <= 30) {
            bar.style.setProperty('--stock-color', '#ff3366');
        }

        // Random stock decrease simulation
        setInterval(() => {
            const currentLevel = parseInt(bar.style.getPropertyValue('--stock-level'));
            if (currentLevel > 10) {
                const newLevel = currentLevel - Math.random() * 5;
                bar.style.setProperty('--stock-level', `${newLevel}%`);
                
                const stockText = bar.nextElementSibling;
                const pieces = Math.ceil((newLevel / 100) * 10);
                stockText.textContent = pieces === 1 ? 'Last piece!' : `${pieces} pieces left`;

                if (newLevel <= 30) {
                    bar.style.setProperty('--stock-color', '#ff3366');
                }
            }
        }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds
    });
}); 
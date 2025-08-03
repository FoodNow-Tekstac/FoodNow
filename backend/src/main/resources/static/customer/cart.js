/* FILE: customer/cart.js */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const cartContent = document.getElementById('cart-content');
    
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });

    const apiFetch = async (endpoint, options = {}) => {
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error('Cart operation failed.');
        return response.json();
    };

    const fetchCart = async () => {
        cartContent.innerHTML = '<p class="text-text-muted">Loading your cart...</p>';
        try {
            const cart = await apiFetch('/cart');
            renderCart(cart);
        } catch (error) {
            showToast(error.message, 'error');
            cartContent.innerHTML = '<p class="text-red-400">Could not load your cart.</p>';
        }
    };

    const renderCart = (cart) => {
        if (!cart || !cart.items || cart.items.length === 0) {
            cartContent.innerHTML = `
                <div class="text-center">
                    <h2 class="text-2xl font-bold">Your Cart is Empty</h2>
                    <p class="text-text-muted mt-2">Looks like you haven't added any items yet.</p>
                </div>
            `;
            return;
        }

        const backendBaseUrl = API_BASE_URL.replace('/api', '');

        const itemsHtml = cart.items.map(item => {
            // THIS IS THE FIX: The backend sends a FoodItemDto inside the CartItemDto
            const foodItem = item.foodItem;
            const imageUrl = foodItem.imageUrl 
                ? `${backendBaseUrl}${foodItem.imageUrl}` 
                : 'https://placehold.co/48x48/1f2937/9ca3af?text=No+Img';

            return `
                <div class="flex justify-between items-center py-4 border-b border-border">
                    <div class="flex items-center gap-4">
                        <img src="${imageUrl}" alt="${foodItem.name}" class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <p class="font-bold">${foodItem.name}</p>
                            <p class="text-sm text-text-muted">₹${foodItem.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button class="font-bold text-lg" data-id="${item.id}" data-quantity="${item.quantity}" data-action="decrease">-</button>
                            <span class="font-semibold w-8 text-center">${item.quantity}</span>
                            <button class="font-bold text-lg" data-id="${item.id}" data-quantity="${item.quantity}" data-action="increase">+</button>
                        </div>
                        <p class="font-semibold w-24 text-right">₹${(foodItem.price * item.quantity).toFixed(2)}</p>
                        <button class="text-red-500 hover:text-red-400 text-2xl font-bold" data-id="${item.id}" data-action="remove">&times;</button>
                    </div>
                </div>
            `;
        }).join('');

        cartContent.innerHTML = `
            <div id="cart-items">
                ${itemsHtml}
            </div>
            <div class="mt-6 flex justify-between items-center">
                <p class="text-xl font-bold">Total:</p>
                <p class="text-2xl font-extrabold text-primary">₹${cart.totalPrice.toFixed(2)}</p>
            </div>
            <div class="mt-8">
                <button id="checkout-btn" class="btn-primary w-full py-3 rounded-lg font-semibold text-lg">
                    Proceed to Payment
                </button>
            </div>
        `;
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            if (newQuantity < 1) {
                await apiFetch(`/cart/items/${cartItemId}`, { method: 'DELETE' });
                showToast('Item removed from cart.', 'success');
            } else {
                await apiFetch(`/cart/items/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity: newQuantity }) });
            }
            fetchCart(); // Refresh cart after update
        } catch(error) {
            showToast('Could not update cart.', 'error');
        }
    };

    cartContent.addEventListener('click', (e) => {
        if (e.target.id === 'checkout-btn') {
            window.location.href = 'payment.html';
            return;
        }
        
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        if (!action || !id) return;

        const currentQuantity = parseInt(e.target.dataset.quantity);

        if (action === 'increase') {
            updateQuantity(id, currentQuantity + 1);
        } else if (action === 'decrease') {
            updateQuantity(id, currentQuantity - 1);
        } else if (action === 'remove') {
            updateQuantity(id, 0); // Deletes the item
        }
    });

    fetchCart();
});

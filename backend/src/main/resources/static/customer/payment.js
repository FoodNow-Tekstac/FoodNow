document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const orderSummary = document.getElementById('order-summary');
    const confirmBtn = document.getElementById('confirm-payment-btn');
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });

    const fetchCartSummary = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not fetch cart for summary.');
            const cart = await response.json();
            renderSummary(cart);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const renderSummary = (cart) => {
        if (!cart || !cart.items || cart.items.length === 0) {
             orderSummary.innerHTML = `<p class="text-red-400">Your cart is empty. Cannot proceed.</p>`;
             confirmBtn.disabled = true;
             confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
             return;
        }
        const itemsHtml = cart.items.map(item => `<li class="flex justify-between"><span class="text-text-muted">${item.quantity} x ${item.foodItem.name}</span> <span>₹${(item.foodItem.price * item.quantity).toFixed(2)}</span></li>`).join('');
        orderSummary.innerHTML = `
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>
            <ul class="space-y-2">${itemsHtml}</ul>
            <div class="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-border">
                <span>Total</span>
                <span class="text-primary">₹${cart.totalPrice.toFixed(2)}</span>
            </div>
        `;
    };

    const placeOrder = async () => {
        showToast('Placing your order...', 'loading');
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processing...';
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not place order.');
            
            showToast('Order placed successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 1500);

        } catch (error) {
            showToast(error.message, 'error');
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm Payment & Place Order';
        }
    };

    confirmBtn.addEventListener('click', placeOrder);
    fetchCartSummary();
});

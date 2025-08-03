/* FILE: customer/orders.js */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const ordersContainer = document.getElementById('orders-container');
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });

    const fetchOrders = async () => {
        ordersContainer.innerHTML = '<p class="text-text-muted">Loading your order history...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not fetch your orders.');
            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            showToast(error.message, 'error');
            ordersContainer.innerHTML = '<p class="text-red-400">Could not load your order history.</p>';
        }
    };

    const renderOrders = (orders) => {
        ordersContainer.innerHTML = '';
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-text-muted">You have not placed any orders yet.</p>';
            return;
        }

        orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)); // Show newest first

        orders.forEach(order => {
            const orderCardWrapper = document.createElement('a');
            // This now links to the new tracking page
            orderCardWrapper.href = `track-order.html?orderId=${order.id}`;
            orderCardWrapper.className = 'block bg-surface p-6 rounded-lg shadow-lg hover:bg-gray-700 transition';
            
            const itemsHtml = order.items.map(item => `<li>${item.quantity} x ${item.itemName}</li>`).join('');
            
            orderCardWrapper.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold">${order.restaurantName}</h3>
                        <p class="text-sm text-text-muted">Order #${order.id} &bull; ${new Date(order.orderTime).toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-primary">₹${order.totalPrice.toFixed(2)}</p>
                        <p class="font-semibold px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(order.status)}">${order.status.replace('_', ' ')}</p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-border">
                    <h4 class="font-semibold mb-2">Items:</h4>
                    <ul class="list-disc list-inside text-text-muted">
                        ${itemsHtml}
                    </ul>
                </div>
                <div class="text-right mt-4 text-primary font-semibold">
                    Track Order &rarr;
                </div>
            `;
            ordersContainer.appendChild(orderCardWrapper);
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            DELIVERED: 'bg-green-500 text-white',
            OUT_FOR_DELIVERY: 'bg-blue-500 text-white',
            PREPARING: 'bg-yellow-500 text-black',
            CONFIRMED: 'bg-yellow-500 text-black',
            PENDING: 'bg-gray-500 text-white',
            CANCELLED: 'bg-red-500 text-white'
        };
        return colors[status] || 'bg-gray-600';
    };

    fetchOrders();
});
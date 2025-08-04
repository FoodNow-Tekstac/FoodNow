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

    const showToast = (message, type = 'info') => {
        const toast = document.getElementById('toast');
        toast.textContent = message;

        toast.className =
            'fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-50 opacity-0';

        switch (type) {
            case 'success':
                toast.classList.add('bg-green-600');
                break;
            case 'error':
                toast.classList.add('bg-red-600');
                break;
            case 'loading':
                toast.classList.add('bg-yellow-600');
                break;
            default:
                toast.classList.add('bg-gray-800');
        }

        toast.classList.add('opacity-100');
        setTimeout(() => toast.classList.remove('opacity-100'), 3000);
    };

    const fetchOrders = async () => {
        ordersContainer.innerHTML = '<p class="text-text-muted">Loading your order history...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                showToast('Session expired. Please log in again.', 'error');
                setTimeout(() => {
                    localStorage.removeItem('foodnow_token');
                    window.location.href = '../index.html';
                }, 2000);
                return;
            }

            if (!response.ok) throw new Error('Could not fetch your orders.');

            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            showToast(error.message || 'Something went wrong.', 'error');
            ordersContainer.innerHTML =
                '<p class="text-red-400">Could not load your order history.</p>';
        }
    };

    const renderOrders = (orders) => {
        ordersContainer.innerHTML = '';
        if (!orders.length) {
            ordersContainer.innerHTML =
                '<p class="text-text-muted">You have not placed any orders yet.</p>';
            return;
        }

        orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

        orders.forEach((order) => {
            const orderCardWrapper = document.createElement('div');
            orderCardWrapper.className = 'bg-surface p-6 rounded-lg shadow-lg';

            const itemsHtml = order.items
                .map((item) => `<li>${item.quantity} x ${item.itemName}</li>`)
                .join('');

            let actionButtonHtml = `
                <a href="track-order.html?orderId=${order.id}" class="text-primary font-semibold">
                    Track Order &rarr;
                </a>
            `;
           if (order.status === 'DELIVERED' && !order.hasReview) {
    actionButtonHtml = `
        <a href="review.html?orderId=${order.id}" class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
            Leave a Review
        </a>
    `;
} else if (order.status === 'DELIVERED' && order.hasReview) {
    actionButtonHtml = `
        <p class="text-sm text-green-400 font-semibold">Review Submitted!</p>
    `;
}


            orderCardWrapper.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold">${order.restaurantName}</h3>
                        <p class="text-sm text-text-muted">
                            Order #${order.id} • ${new Date(order.orderTime).toLocaleString()}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-primary">₹${order.totalPrice.toFixed(2)}</p>
                        <p class="font-semibold px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(
                            order.status
                        )}">
                            ${order.status.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-border">
                    <h4 class="font-semibold mb-2">Items:</h4>
                    <ul class="list-disc list-inside text-text-muted">
                        ${itemsHtml}
                    </ul>
                </div>
                <div class="text-right mt-4">
                    ${actionButtonHtml}
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
            CANCELLED: 'bg-red-500 text-white',
        };
        return colors[status] || 'bg-gray-600';
    };

    fetchOrders();
});

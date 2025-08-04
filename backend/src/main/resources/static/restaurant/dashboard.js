document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // --- State Management ---
    let restaurantData = {};
    let currentSection = 'overview';
    let orderCheckInterval;

    // --- Element References ---
    const mainContent = document.getElementById('main-content');
    const navContainer = document.getElementById('dashboard-nav');
    const logoutBtn = document.getElementById('logout-btn');
    const restaurantNameHeader = document.getElementById('restaurant-name-header');
    
    // Modal Elements
    const itemModal = document.getElementById('item-modal');
    const modalTitle = document.getElementById('modal-title');
    const itemForm = document.getElementById('item-form');
    const closeBtn = document.getElementById('close-modal-btn');

    // --- API Functions ---
    const apiFetch = async (endpoint, options = {}) => {
        if (!(options.body instanceof FormData)) {
            options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            if(response.status === 403) {
                showToast('Authorization failed. Please log in again.', 'error');
                setTimeout(() => window.location.href = '../index.html', 2000);
            }
            const errorData = await response.json().catch(() => ({ message: 'API request failed.' }));
            throw new Error(errorData.message || 'API request failed.');
        }
        
        // THIS IS THE FIX: Check if the response has content before trying to parse it.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            return null; // Return null for empty responses
        }
    };

    const fetchDashboardData = async () => {
        try {
            restaurantData = await apiFetch('/restaurant/dashboard');
            restaurantNameHeader.textContent = restaurantData.restaurantProfile.name;
            renderContent(currentSection);
            startOrderCheck();
        } catch (error) {
            showToast('Could not load dashboard data.', 'error');
        }
    };

    // --- Rendering Functions ---
    const renderContent = (section) => {
        mainContent.innerHTML = '';
        anime({ targets: '#main-content', opacity: [0, 1], translateY: [10, 0], duration: 400, easing: 'easeOutQuad' });
        switch (section) {
            case 'overview': renderOverview(); break;
            case 'orders': renderOrderManagement(); break;
            case 'menu': renderMenuManagement(); break;
            case 'reviews': renderReviews(); break;
        }
    };

    const renderOverview = () => {
        const pendingOrders = (restaurantData.orders || []).filter(o => o.status === 'PENDING').length;
        const totalRevenue = (restaurantData.orders || [])
            .filter(o => o.status === 'DELIVERED')
            .reduce((sum, o) => sum + o.totalPrice, 0);
        
        mainContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-surface p-6 rounded-lg"><p class="text-sm text-text-muted">Pending Orders</p><p class="text-4xl font-bold">${pendingOrders}</p></div>
                <div class="bg-surface p-6 rounded-lg"><p class="text-sm text-text-muted">Total Menu Items</p><p class="text-4xl font-bold">${(restaurantData.menu || []).length}</p></div>
                <div class="bg-surface p-6 rounded-lg"><p class="text-sm text-text-muted">Total Revenue (Delivered)</p><p class="text-4xl font-bold">₹${totalRevenue.toFixed(2)}</p></div>
            </div>
        `;
    };

    const renderOrderManagement = () => {
        const statuses = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        mainContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${statuses.map(status => `
                    <div id="orders-${status}">
                        <h3 class="text-lg font-semibold mb-4 capitalize">${status.replace('_', ' ').toLowerCase()}</h3>
                        <div class="space-y-4"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (Array.isArray(restaurantData.orders)) {
            restaurantData.orders.forEach(order => {
                const container = document.querySelector(`#orders-${order.status} > div`);
                if (container) {
                    const orderCard = document.createElement('div');
                    orderCard.className = 'bg-surface p-4 rounded-lg';
                 const itemsHtml = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map(item => `<li>${item.quantity} x ${item.itemName}</li>`).join('')
    : '<li>No items listed.</li>';

                    
                    let reviewHtml = '';
                    if (order.status === 'DELIVERED' && order.hasReview) {
                        reviewHtml = `
                            <div class="mt-4 pt-4 border-t border-border">
                                <p class="font-semibold text-sm text-yellow-400">Rating: ${'&#9733;'.repeat(order.reviewRating)}</p>
                                <p class="text-sm text-text-muted italic">"${order.reviewComment}"</p>
                            </div>
                        `;
                    }

                    orderCard.innerHTML = `
                        <p class="font-bold">Order #${order.id} (Customer: ${order.customerName})</p>
                        <ul class="text-sm text-text-muted list-disc list-inside my-2">${itemsHtml}</ul>
                        <p class="font-semibold">Total: ₹${order.totalPrice.toFixed(2)}</p>
                        <div class="mt-4 flex gap-2">
                            ${order.status === 'PENDING' ? `
                                <button class="btn-success text-sm font-semibold py-1 px-2 rounded-md flex-1" data-id="${order.id}" data-action="ACCEPT">Accept</button>
                                <button class="btn-danger text-sm font-semibold py-1 px-2 rounded-md flex-1" data-id="${order.id}" data-action="REJECT">Reject</button>
                            ` : ''}
                            ${order.status === 'PREPARING' ? `
                                <button class="btn-primary text-sm font-semibold py-1 px-2 rounded-md w-full" data-id="${order.id}" data-action="READY_FOR_PICKUP">Ready for Pickup</button>
                            ` : ''}
                        </div>
                        ${reviewHtml}
                    `;
                    container.appendChild(orderCard);
                }
            });
        }
    };
    
    const renderMenuManagement = () => {
        mainContent.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold">Your Menu</h3>
                <button id="add-item-btn" class="btn-primary px-4 py-2 rounded-lg font-semibold">Add New Item</button>
            </div>
            <div class="bg-surface rounded-lg border border-border">
                <table class="min-w-full">
                    <thead class="border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left">Item</th>
                            <th class="px-6 py-3 text-left">Category</th>
                            <th class="px-6 py-3 text-left">Price</th>
                            <th class="px-6 py-3 text-left">Available</th>
                            <th class="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="menu-table-body"></tbody>
                </table>
            </div>
        `;
        const menuTableBody = document.getElementById('menu-table-body');
        if (Array.isArray(restaurantData.menu)) {
            restaurantData.menu.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'border-b border-border';
                const backendBaseUrl = API_BASE_URL.replace('/api', '');
                const imageUrl = item.imageUrl ? `${backendBaseUrl}${item.imageUrl}` : 'https://placehold.co/40x40/1f2937/9ca3af?text=No+Img';

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full object-cover" src="${imageUrl}" alt="${item.name}">
                            <div class="ml-4"><div class="font-medium">${item.name}</div><div class="text-sm text-text-muted">${item.description}</div></div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-text-muted">
                        <div class="font-semibold">${(item.dietaryType || '').replace('_', ' ')}</div>
                        <div class="text-xs">${(item.category || '').replace('_', ' ')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">₹${item.price.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <label class="switch"><input type="checkbox" data-id="${item.id}" class="availability-toggle" ${item.available ? 'checked' : ''}><span class="slider"></span></label>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-400 hover:text-indigo-300 mr-4" data-id="${item.id}" data-action="edit">Edit</button>
                        <button class="text-red-500 hover:text-red-400" data-id="${item.id}" data-action="delete">Delete</button>
                    </td>
                `;
                menuTableBody.appendChild(row);
            });
        }
    };
    
    const renderReviews = () => {
        if (!restaurantData.reviews || restaurantData.reviews.length === 0) {
            mainContent.innerHTML = `<p class="text-text-muted">You have not received any reviews yet.</p>`;
            return;
        }

        const reviewsHtml = restaurantData.reviews.map(review => `
            <div class="bg-surface p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <p class="font-bold">${review.customerName}</p>
                    <p class="font-semibold text-yellow-400">${'&#9733;'.repeat(review.rating)}</p>
                </div>
                <p class="text-sm text-text-muted mt-1">${new Date(review.reviewDate).toLocaleString()}</p>
                <p class="mt-4 italic">"${review.comment}"</p>
            </div>
        `).join('');

        mainContent.innerHTML = `<div class="space-y-4">${reviewsHtml}</div>`;
    };

    const openItemModal = (item = null) => {
        itemForm.reset();
        document.getElementById('item-imageUrl').value = '';
        if (item) {
            modalTitle.textContent = 'Edit Item';
            document.getElementById('item-id').value = item.id;
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-description').value = item.description;
            document.getElementById('item-price').value = item.price;
            document.getElementById('item-imageUrl').value = item.imageUrl;
            document.getElementById('item-category').value = item.category;
            document.getElementById('item-dietaryType').value = item.dietaryType;
        } else {
            modalTitle.textContent = 'Add New Item';
            document.getElementById('item-id').value = '';
        }
        itemModal.classList.remove('hidden');
        itemModal.classList.add('flex');
    };

    const closeItemModal = () => itemModal.classList.add('hidden');
    
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(itemForm);
        const itemData = Object.fromEntries(formData.entries());
        const itemId = itemData.id;
        const imageFile = formData.get('image');

        showToast('Saving item...', 'loading');

        try {
            if (imageFile && imageFile.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                const uploadResult = await apiFetch('/files/upload', { method: 'POST', body: imageFormData });
                itemData.imageUrl = uploadResult.filePath;
            }

            const url = itemId ? `/restaurant/menu/${itemId}` : '/restaurant/menu';
            const method = itemId ? 'PUT' : 'POST';
            
            await apiFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemData) });
            
            showToast(`Item ${itemId ? 'updated' : 'added'} successfully!`, 'success');
            closeItemModal();
            fetchDashboardData();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    const startOrderCheck = () => { /* ... same as before ... */ };

    navContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            currentSection = e.target.dataset.section;
            navContainer.querySelector('.active')?.classList.remove('active');
            e.target.classList.add('active');
            renderContent(currentSection);
        }
    });
    
    mainContent.addEventListener('click', async (e) => {
        const target = e.target;
        
        if (target.id === 'add-item-btn') {
            openItemModal();
            return;
        }

        const action = target.dataset.action;
        const id = target.dataset.id;
        if (!action || !id) return;

        if (action === 'edit') {
            const item = restaurantData.menu.find(i => i.id == id);
            openItemModal(item);
        } else if (action === 'delete') {
            if (confirm('Are you sure you want to delete this item?')) {
                await apiFetch(`/restaurant/menu/${id}`, { method: 'DELETE' });
                showToast('Item deleted.', 'success');
                fetchDashboardData();
            }
        } else if (target.classList.contains('availability-toggle')) {
            await apiFetch(`/restaurant/menu/${id}/availability`, { method: 'PATCH' });
            showToast('Availability updated.', 'success');
        } else if (['ACCEPT', 'REJECT', 'READY_FOR_PICKUP'].includes(action)) {
            if (action === 'READY_FOR_PICKUP') {
                showToast('Finding a delivery agent...', 'loading');
                try {
                    await apiFetch(`/restaurant/orders/${id}/ready`, { method: 'POST' });
                    showToast('Delivery agent assigned automatically!', 'success');
                } catch (error) {
                    showToast(error.message || 'No delivery agents available.', 'error');
                }
            } else {
                const newStatus = action === 'ACCEPT' ? 'PREPARING' : 'CANCELLED';
                try {
                    await apiFetch(`/manage/orders/${id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    });
                    showToast('Order status updated.', 'success');
                } catch (error) {
                    showToast('Failed to update status.', 'error');
                }
            }
            fetchDashboardData(); // Refresh data after any action
        }
    });
    
    logoutBtn.addEventListener('click', () => {
        clearInterval(orderCheckInterval);
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });
    
    closeBtn.addEventListener('click', closeItemModal);
    
    fetchDashboardData();
});

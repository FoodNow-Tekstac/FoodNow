document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) window.location.href = '../index.html';
    
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get('id');
    if (!restaurantId) window.location.href = 'dashboard.html';

    const restaurantNameEl = document.getElementById('restaurant-name');
    const restaurantAddressEl = document.getElementById('restaurant-address');
    const menuContainer = document.getElementById('menu-container');

    const fetchMenu = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/public/restaurants/${restaurantId}/menu`);
            if (!response.ok) throw new Error('Restaurant not found.');
            const restaurant = await response.json();
            renderMenu(restaurant);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const renderMenu = (restaurant) => {
        restaurantNameEl.textContent = restaurant.name;
        restaurantAddressEl.textContent = restaurant.address;
        menuContainer.innerHTML = '';
        if (!restaurant.menu || restaurant.menu.length === 0) {
            menuContainer.innerHTML = '<p class="text-text-muted col-span-full">This restaurant has no items on its menu yet.</p>';
            return;
        }

        const backendBaseUrl = API_BASE_URL.replace('/api', '');

        restaurant.menu.forEach(item => {
            const imageUrl = item.imageUrl ? `${backendBaseUrl}${item.imageUrl}` : '[https://placehold.co/600x400/1f2937/9ca3af?text=No+Img](https://placehold.co/600x400/1f2937/9ca3af?text=No+Img)';
            const itemEl = document.createElement('div');
            // THIS IS THE FIX: A new card layout using flexbox
            itemEl.className = 'bg-surface rounded-lg shadow-lg overflow-hidden flex flex-col';
            itemEl.innerHTML = `
                <img src="${imageUrl}" alt="${item.name}" class="w-full h-40 object-cover">
                <div class="p-4 flex flex-col flex-grow">
                    <h4 class="text-lg font-bold">${item.name}</h4>
                    <p class="text-sm text-text-muted mt-1 flex-grow">${item.description}</p>
                    <p class="text-lg font-semibold mt-2 text-primary">₹${item.price.toFixed(2)}</p>
                    <div class="mt-4 flex items-center gap-2">
                        <input type="number" value="1" min="1" class="form-input w-20 text-center quantity-input">
                        <button data-item-id="${item.id}" class="add-to-cart-btn btn-primary flex-grow py-2 px-4 rounded-lg font-semibold">Add to Cart</button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(itemEl);
        });
    };

    menuContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const foodItemId = e.target.dataset.itemId;
            const quantityInput = e.target.previousElementSibling;
            const quantity = parseInt(quantityInput.value, 10);

            if (isNaN(quantity) || quantity < 1) {
                showToast('Please enter a valid quantity.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/cart/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ foodItemId: parseInt(foodItemId), quantity })
                });
                if (!response.ok) throw new Error('Could not add item to cart.');
                showToast(`Item added to cart!`, 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });

    fetchMenu();
});

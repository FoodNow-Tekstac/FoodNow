document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    let allRestaurants = [];

    const API_BASE_URL = 'http://localhost:8080/api';
    const baseUrl = API_BASE_URL.replace('/api', '');

    const restaurantsContainer = document.getElementById('restaurants-container');
    const searchBar = document.getElementById('search-bar');
    const dietaryFilter = document.getElementById('dietary-filter');
    const categoryFilter = document.getElementById('category-filter');
    const logoutBtn = document.getElementById('logout-btn');
    const openModalBtn = document.getElementById('apply-restaurant-link');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const applicationForm = document.getElementById('application-form');

    const showToast = (msg, type) => {
        // Basic toast logic - optionally replace with your UI library
        alert(`${type.toUpperCase()}: ${msg}`);
    };

    const apiFetch = async (endpoint, options = {}) => {
        if (!(options.body instanceof FormData)) {
            options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };

        const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!res.ok) throw new Error('API request failed');
        return res.json();
    };

    const fetchRestaurants = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/public/restaurants`);
            if (!res.ok) throw new Error('Could not fetch restaurants.');
            allRestaurants = await res.json();
            renderRestaurants(allRestaurants);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const renderRestaurants = (restaurants) => {
        restaurantsContainer.innerHTML = '';
        if (restaurants.length === 0) {
            restaurantsContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center">No restaurants match your search.</p>';
            return;
        }

        restaurants.forEach(r => {
            const card = document.createElement('div');
            card.className = 'bg-surface rounded-lg shadow-md hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden';

            const imgUrl = r.imageUrl ? `${baseUrl}${r.imageUrl}` : 'https://placehold.co/600x400/1f2937/9ca3af?text=FoodNow';

            let matchingItemsHtml = '';
            if (r.matchingItems && r.matchingItems.length > 0) {
                matchingItemsHtml = `
                    <div class="bg-gray-800 p-4 mt-4">
                        <h4 class="font-semibold text-sm mb-2 text-primary">Matching Items:</h4>
                        <ul class="text-sm space-y-1">
                            ${r.matchingItems.map(item => `
                                <li class="text-text-muted">${item.name} - ₹${item.price.toFixed(2)}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }

            card.innerHTML = `
                <a href="restaurant.html?id=${r.id}" class="block">
                    <img src="${imgUrl}" class="h-40 w-full object-cover" alt="${r.name}">
                    <div class="p-4">
                        <h3 class="text-xl font-bold text-primary">${r.name}</h3>
                        <p class="text-text-muted mt-1">${r.address}</p>
                    </div>
                </a>
                ${matchingItemsHtml}
            `;
            restaurantsContainer.appendChild(card);
        });
    };

    const applyFilters = () => {
        const term = searchBar.value.toLowerCase();
        const diet = dietaryFilter.value;
        const category = categoryFilter.value;

        if (!term && diet === 'ALL' && category === 'ALL') {
            allRestaurants.forEach(r => r.matchingItems = []);
            renderRestaurants(allRestaurants);
            return;
        }

        const filteredRestaurants = [];

        allRestaurants.forEach(restaurant => {
            const restaurantCopy = { ...restaurant, matchingItems: [] };

            let menuFiltered = restaurant.menu || [];

            if (diet !== 'ALL') {
                menuFiltered = menuFiltered.filter(item => item.dietaryType === diet);
            }

            if (category !== 'ALL') {
                menuFiltered = menuFiltered.filter(item => item.category === category);
            }

            if (menuFiltered.length > 0) {
                const restaurantNameMatch = term && restaurant.name.toLowerCase().includes(term);
                const itemMatches = menuFiltered.filter(item => term && item.name.toLowerCase().includes(term));

                if (restaurantNameMatch) {
                    restaurantCopy.matchingItems = menuFiltered;
                    filteredRestaurants.push(restaurantCopy);
                } else if (itemMatches.length > 0) {
                    restaurantCopy.matchingItems = itemMatches;
                    filteredRestaurants.push(restaurantCopy);
                } else if (!term) {
                    restaurantCopy.matchingItems = menuFiltered;
                    filteredRestaurants.push(restaurantCopy);
                }
            }
        });

        renderRestaurants(filteredRestaurants);
    };

    // Modal Logic
    const openModal = () => {
        modalBackdrop.classList.remove('hidden');
        modalBackdrop.classList.add('flex');
    };

    const closeModal = () => {
        modalBackdrop.classList.add('hidden');
        modalBackdrop.classList.remove('flex');
    };

    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(applicationForm);
        const appData = Object.fromEntries(formData.entries());
        const imageFile = formData.get('image');

        showToast('Submitting application...', 'loading');

        try {
            if (imageFile && imageFile.size > 0) {
                const imageForm = new FormData();
                imageForm.append('image', imageFile);
                const uploadResult = await apiFetch('/files/upload', {
                    method: 'POST',
                    body: imageForm
                });
                appData.imageUrl = uploadResult.filePath;
            }

            await apiFetch('/restaurant/apply', {
                method: 'POST',
                body: JSON.stringify(appData)
            });

            showToast('Application submitted!', 'success');
            applicationForm.reset();
            setTimeout(closeModal, 1500);
        } catch (err) {
            showToast('Submission failed.', 'error');
        }
    });

    // Event Listeners
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    searchBar.addEventListener('input', applyFilters);
    dietaryFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    fetchRestaurants();
});

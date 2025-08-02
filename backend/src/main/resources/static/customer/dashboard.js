document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    let allRestaurants = []; // To store the original list for filtering

    const restaurantsContainer = document.getElementById('restaurants-container');
    const searchBar = document.getElementById('search-bar');
    const sortFilter = document.getElementById('sort-filter');
    const logoutBtn = document.getElementById('logout-btn');
    const openModalBtn = document.getElementById('apply-restaurant-link');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const applicationForm = document.getElementById('application-form');

    const apiFetch = async (endpoint, options = {}) => {
        // Don't set Content-Type for FormData, browser does it automatically with boundary
        if (!(options.body instanceof FormData)) {
            options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error('API request failed.');
        return response.json();
    };

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/public/restaurants`);
            if (!response.ok) throw new Error('Could not fetch restaurants.');
            allRestaurants = await response.json();
            renderRestaurants(allRestaurants);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const renderRestaurants = (restaurants) => {
        restaurantsContainer.innerHTML = '';
        if (restaurants.length === 0) {
            restaurantsContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center">No restaurants match your search.</p>';
            return;
        }
        restaurants.forEach(restaurant => {
            const card = document.createElement('a');
            card.href = `restaurant.html?id=${restaurant.id}`;
            card.className = 'bg-surface rounded-lg shadow-md hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden';
            
            const backendBaseUrl = API_BASE_URL.replace('/api', '');
            // THIS IS THE FIX: Removed the incorrect markdown formatting from the placeholder URL.
const imageUrl = restaurant.imageUrl
    ? `${backendBaseUrl}${restaurant.imageUrl}`
    : 'https://placehold.co/600x400/1f2937/9ca3af?text=FoodNow';

            card.innerHTML = `
                <img class="h-40 w-full object-cover" src="${imageUrl}" alt="${restaurant.name}">
                <div class="p-4">
                    <h3 class="text-xl font-bold text-primary">${restaurant.name}</h3>
                    <p class="text-text-muted mt-1">${restaurant.address}</p>
                </div>
            `;
            restaurantsContainer.appendChild(card);
        });
    };

    const filterAndSortRestaurants = () => {
        let filtered = [...allRestaurants];
        const searchTerm = searchBar.value.toLowerCase();
        
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.name.toLowerCase().includes(searchTerm) || 
                r.address.toLowerCase().includes(searchTerm)
            );
        }

        const sortValue = sortFilter.value;
        if (sortValue === 'name_asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'name_desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        renderRestaurants(filtered);
    };

    const openModal = () => {
        modalBackdrop.classList.remove('hidden');
        modalBackdrop.classList.add('flex');
    };
    const closeModal = () => {
        modalBackdrop.classList.add('hidden');
        modalBackdrop.classList.remove('flex');
    };

    // --- Event Listeners ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });
    
    searchBar.addEventListener('input', filterAndSortRestaurants);
    sortFilter.addEventListener('change', filterAndSortRestaurants);
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    applicationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(applicationForm);
        const appData = Object.fromEntries(formData.entries());
        const imageFile = formData.get('image');
        showToast('Submitting application...', 'loading');

        try {
            // Step 1: If an image was selected, upload it first.
            if (imageFile && imageFile.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                const uploadResult = await apiFetch('/files/upload', {
                    method: 'POST',
                    body: imageFormData
                });
                appData.imageUrl = uploadResult.filePath; // Add the returned path to our data
            }

            // Step 2: Submit the application form data (with the new imageUrl if applicable).
            await apiFetch('/restaurant/apply', {
                method: 'POST',
                body: JSON.stringify(appData)
            });

            showToast('Application submitted successfully!', 'success');
            applicationForm.reset();
            setTimeout(closeModal, 1500);
        } catch (error) {
            showToast('An error occurred. Please try again.', 'error');
        }
    });

    // Initial Load
    fetchRestaurants();
});

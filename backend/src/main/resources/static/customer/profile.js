
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // --- Element References ---
    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const imagePreview = document.getElementById('profile-image-preview');
    const imageUploadInput = document.getElementById('profile-image-upload');
    const imageUrlHiddenInput = document.getElementById('profileImageUrl');
    const logoutBtn = document.getElementById('logout-btn');

    const apiFetch = async (endpoint, options = {}) => {
        if (!(options.body instanceof FormData)) {
            options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'API request failed.' }));
            throw new Error(errorData.message || 'API request failed.');
        }
        return response.json();
    };

    const fetchProfile = async () => {
        try {
            const profile = await apiFetch('/profile');
            nameInput.value = profile.name;
            emailInput.value = profile.email;
            phoneInput.value = profile.phoneNumber;
            imageUrlHiddenInput.value = profile.profileImageUrl || '';
            if (profile.profileImageUrl) {
                const backendBaseUrl = API_BASE_URL.replace('/api', '');
                imagePreview.src = `${backendBaseUrl}${profile.profileImageUrl}`;
            }
        } catch (error) {
            showToast('Could not load your profile.', 'error');
        }
    };

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result; // Show a preview immediately
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showToast('Saving profile...', 'loading');

        const updateData = {
            name: nameInput.value,
            phoneNumber: phoneInput.value,
            profileImageUrl: imageUrlHiddenInput.value // Start with the existing URL
        };

        const imageFile = imageUploadInput.files[0];

        try {
            // Step 1: If a new image was selected, upload it first.
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                const uploadResult = await apiFetch('/files/upload', {
                    method: 'POST',
                    body: imageFormData
                });
                updateData.profileImageUrl = uploadResult.filePath; // Update with the new path
            }

            // Step 2: Update the profile with the new data.
            const updatedProfile = await apiFetch('/profile', {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            showToast('Profile updated successfully!', 'success');
            // Repopulate form with potentially new data (like the new image URL)
            nameInput.value = updatedProfile.name;
            phoneInput.value = updatedProfile.phoneNumber;
            imageUrlHiddenInput.value = updatedProfile.profileImageUrl || '';

        } catch (error) {
            showToast(error.message || 'Failed to update profile.', 'error');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });

    // Initial Load
    fetchProfile();
});

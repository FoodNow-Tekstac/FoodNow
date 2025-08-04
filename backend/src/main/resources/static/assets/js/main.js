/* FILE: assets/js/main.js (UPDATED) */
const API_BASE_URL = 'http://localhost:8080/api';

// --- Reusable Utility Functions ---
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return {}; }
}

// --- Authentication Logic (For index.html) ---
document.addEventListener('DOMContentLoaded', () => {
    // THIS IS THE FIX: Only run this code if we are on the login page
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        const loginFormEl = document.getElementById('login-form');
        const registerFormEl = document.getElementById('register-form');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');
        const loginFormElement = document.getElementById('login-form-element');
        const registerFormElement = document.getElementById('register-form-element');

        const switchForms = (outgoingForm, incomingForm) => {
            anime.timeline({ easing: 'easeOutExpo', duration: 600 })
            .add({ targets: outgoingForm, translateX: outgoingForm === loginFormEl ? '-100%' : '100%', opacity: 0 })
            .add({ targets: incomingForm, translateX: [incomingForm === loginFormEl ? '100%' : '-100%', '0%'], opacity: 1 }, '-=500');
        };

        showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); switchForms(loginFormEl, registerFormEl); });
        showLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchForms(registerFormEl, loginFormEl); });

        loginFormElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginFormElement);
            const data = Object.fromEntries(formData.entries());
            showToast('Logging in...', 'loading');

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem('foodnow_token', result.accessToken);
                    showToast('Login successful! Redirecting...', 'success');
                    
                    const decodedToken = parseJwt(result.accessToken);
                    const userRole = decodedToken.roles[0]; 

                    setTimeout(() => {
                        if (userRole === 'ROLE_ADMIN') window.location.href = 'admin/dashboard.html';
                        else if (userRole === 'ROLE_RESTAURANT_OWNER') window.location.href = 'restaurant/dashboard.html';
                        else if (userRole === 'ROLE_DELIVERY_PERSONNEL') window.location.href = 'delivery/dashboard.html';
                        else window.location.href = 'customer/dashboard.html';
                    }, 1500);
                } else {
                    const error = await response.json();
                    showToast(error.message || 'Login failed.', 'error');
                }
            } catch (error) {
                showToast('An error occurred. Please try again.', 'error');
            }
        });
        registerFormElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(registerFormElement);
            const data = Object.fromEntries(formData.entries());
            showToast('Creating account...', 'loading');

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const resultText = await response.text();
                    showToast(resultText, 'success');
                    setTimeout(() => {
                       switchForms(registerFormEl, loginFormEl);
                       event.target.reset();
                    }, 2000);
                } else {
                    const error = await response.json();
                    showToast(error.message || 'Registration failed.', 'error');
                }
            } catch (error) {
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }
});

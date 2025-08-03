document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Get the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        showToast('Invalid or missing reset token.', 'error');
        form.querySelector('button').disabled = true;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        showToast('Resetting your password...', 'loading');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, newPassword: newPassword })
            });

            const message = await response.text();
            if (!response.ok) throw new Error(message);

            showToast(message, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});

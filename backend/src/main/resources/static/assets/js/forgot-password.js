document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('#email').value;
        showToast('Generating reset link...', 'loading');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (!response.ok) throw new Error("An error occurred.");
            
            // THIS IS THE CHANGE: Redirect to a confirmation page with the link
            if (result.resetLink) {
                window.location.href = `forgot-password-confirmation.html?link=${encodeURIComponent(result.resetLink)}`;
            } else {
                showToast(result.message, 'success');
            }
            form.reset();

        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});

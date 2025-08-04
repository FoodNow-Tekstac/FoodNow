document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('foodnow_token');
    if (!token) window.location.href = '../index.html';

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    if (!orderId) window.location.href = 'orders.html';

    document.getElementById('review-title').textContent = `Review for Order #${orderId}`;
    const reviewForm = document.getElementById('review-form');

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(reviewForm);
        const rating = formData.get('rating');
        const comment = formData.get('comment');

        if (!rating) {
            showToast('Please select a star rating.', 'error');
            return;
        }

        showToast('Submitting your review...', 'loading');

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: parseInt(rating),
                    comment: comment
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit review.');
            }

            showToast('Thank you for your feedback!', 'success');
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 2000);

        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('foodnow_token');
        window.location.href = '../index.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) window.location.href = '/index.html';

    // This file would contain logic for the delivery agent to view their
    // assigned orders and update their status to DELIVERED.
    console.log("Delivery dashboard loaded.");
});

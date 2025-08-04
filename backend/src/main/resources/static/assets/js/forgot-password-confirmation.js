document.addEventListener('DOMContentLoaded', () => {
    const resetLinkElement = document.getElementById('reset-link');
    const params = new URLSearchParams(window.location.search);
    const link = params.get('link');

    if (link) {
        const decodedLink = decodeURIComponent(link);
        resetLinkElement.href = decodedLink;
        resetLinkElement.textContent = decodedLink;
    } else {
        resetLinkElement.textContent = "No reset link found.";
    }
});
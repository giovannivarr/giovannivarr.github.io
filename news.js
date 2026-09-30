export function initNewsTimer() {
    const newsItems = document.querySelectorAll('.news-item');
    const now = new Date();
    
    newsItems.forEach(item => {
        const expiryStr = item.getAttribute('data-expiry');
        if (expiryStr) {
            const expiryDate = new Date(expiryStr);
            if (now > expiryDate) {
                item.style.display = 'none';
            }
        }
    });
}
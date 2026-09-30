export function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // 1. Check local storage to see if they already chose a theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateButtonText(currentTheme);
    }

    // 2. Listen for clicks on the toggle button
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonText(newTheme);
    });

    // 3. Change the text of the button depending on the state
    function updateButtonText(theme) {
        toggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}
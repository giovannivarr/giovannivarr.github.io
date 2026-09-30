import { initNewsTimer } from './news.js';
import { initAnimations } from './animations.js';
import { initThemeToggle } from './theme.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Run the theme toggle logic
    initThemeToggle();

    // 2. Run the news timer
    initNewsTimer();

    // 3. Run the list animations
    initAnimations();
});
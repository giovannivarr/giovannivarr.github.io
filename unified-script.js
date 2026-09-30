document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. Theme Toggle Logic ---
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            toggleBtn.textContent = currentTheme === 'dark' ? '☼' : '☾';
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.textContent = newTheme === 'dark' ? '☼' : '☾';
        });
    }

    // --- 1. News Timer Logic ---
    const newsItems = document.querySelectorAll('.news-item');
    const now = new Date();
    newsItems.forEach(item => {
        const expiryStr = item.getAttribute('data-expiry');
        if (expiryStr && now > new Date(expiryStr)) {
            item.style.display = 'none';
        }
    });

    // --- 2. Auto-Link Co-authors ---
    const coAuthors = {
        "Natasha Alechina": "https://research.ou.nl/en/persons/natasha-alechina/",
        "Panos Aronis": "https://www.uu.nl/staff/PAronis",
        "Luca Barbaro": "https://scholar.google.com/citations?user=I0rpsjAAAAAJ&hl=en",
        "Mehdi Dastani": "https://www.uu.nl/staff/MMDastani",
        "Giuseppe De Giacomo": "https://www.diag.uniroma1.it/degiacom/",
        "Claudio Di Ciccio": "https://www.diciccio.net/",
        "Damiano Fornasiere": "https://damianofornasiere.github.io/",
        "Toryn Q. Klassen": "https://www.cs.toronto.edu/~toryn/",
        "Brian Logan": "https://alechina-logan.net/brian/",
        "Johannes Marti": "https://scholar.google.com/citations?user=VGHukfIAAAAJ&hl=en",
        "Sheila A. McIlraith": "https://www.cs.toronto.edu/~sheila/",
        "Marco Montali": "https://www.inf.unibz.it/~montali/",
        "Giuseppe Perelli": "https://giuseppeperelli.github.io/",
        "Roxana Rădulescu": "https://roxanaradulescu.com/",
    };

    document.querySelectorAll('.details-content li').forEach(li => {
        let html = li.innerHTML;
        for (const [author, url] of Object.entries(coAuthors)) {
            const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="author-link">${author}</a>`;
            // Replaces the plain text name with the clickable link
            html = html.split(author).join(linkHTML);
        }
        li.innerHTML = html;
    });

    // --- 3. Smooth Animation for Year Dropdowns ---
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(detail => {
        const summary = detail.querySelector('summary');
        const content = detail.querySelector('.details-content');
        
        if (!summary || !content) return; 
        detail.dataset.animated = 'true';
        let isAnimating = false;

        summary.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (isAnimating) return;
            isAnimating = true;
            
            if (detail.open) {
                content.style.height = content.offsetHeight + 'px';
                content.offsetHeight; 
                content.style.transition = 'height 0.3s ease, opacity 0.3s ease';
                content.style.height = '0px';
                content.style.opacity = '0';
                
                setTimeout(() => {
                    detail.open = false;
                    content.style.transition = '';
                    isAnimating = false;
                }, 300);
            } else {
                detail.open = true;
                content.style.height = '0px';
                content.style.opacity = '0';
                content.offsetHeight; 
                content.style.transition = 'height 0.3s ease, opacity 0.3s ease';
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';
                
                setTimeout(() => {
                    content.style.height = 'auto';
                    content.style.transition = '';
                    isAnimating = false;
                }, 300);
            }
        });
    });

    // --- 4. Live Search (Dropdowns Disabled) ---
    const searchInput = document.getElementById('search-bar');
    const venueFilter = document.getElementById('venue-filter');
    const topicFilter = document.getElementById('topic-filter');

    if (searchInput) {
        function filterPublications() {
            const query = searchInput.value.toLowerCase();
            const venue = venueFilter ? venueFilter.value : 'all';
            const topic = topicFilter ? topicFilter.value : 'all';

            document.querySelectorAll('details').forEach(detail => {
                const items = detail.querySelectorAll('li');
                let hasVisibleItems = false;

                items.forEach(li => {
                    const text = li.textContent.toLowerCase();
                    const itemVenue = li.getAttribute('data-venue') || '';
                    const itemTopics = li.getAttribute('data-topics') || '';

                    const matchesSearch = text.includes(query);
                    const matchesVenue = (venue === 'all' || itemVenue === venue);
                    const matchesTopic = (topic === 'all' || itemTopics.includes(topic));

                    if (matchesSearch && matchesVenue && matchesTopic) {
                        li.style.display = ''; 
                        hasVisibleItems = true;
                    } else {
                        li.style.display = 'none'; 
                    }
                });

                detail.style.display = hasVisibleItems ? '' : 'none';
                
                const content = detail.querySelector('.details-content');
                if (content && detail.open) {
                    content.style.height = 'auto';
                }
            });
        }

        searchInput.addEventListener('input', filterPublications);
        if (venueFilter) venueFilter.addEventListener('change', filterPublications);
        if (topicFilter) topicFilter.addEventListener('change', filterPublications);
    }

    // --- 5. Bulletproof Abstract Toggle (Event Delegation) ---
    // This listens to the whole document, so it never breaks even if the HTML is updated
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.toggle-abstract');
        if (!toggle) return;

        e.preventDefault();
        
        // Prevent clicking while animation is running
        if (toggle.dataset.isAnimating === 'true') return;
        
        const wrapper = toggle.nextElementSibling;
        if (!wrapper || !wrapper.classList.contains('abstract-wrapper')) return;

        toggle.dataset.isAnimating = 'true';
        const isOpen = toggle.classList.contains('open');

        if (isOpen) {
            // Close Animation
            toggle.classList.remove('open');
            wrapper.style.height = wrapper.scrollHeight + 'px';
            wrapper.offsetHeight; // Force browser to register the height
            wrapper.style.height = '0px';
            wrapper.style.opacity = '0';
            
            setTimeout(() => {
                toggle.dataset.isAnimating = 'false';
            }, 300);
        } else {
            // Open Animation
            toggle.classList.add('open');
            wrapper.style.height = wrapper.scrollHeight + 'px';
            wrapper.style.opacity = '1';
            
            setTimeout(() => {
                wrapper.style.height = 'auto'; 
                toggle.dataset.isAnimating = 'false';
            }, 300);
        }
    });
});
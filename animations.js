export function initAnimations() {
    const detailsElements = document.querySelectorAll('details');

    detailsElements.forEach(detail => {
        const summary = detail.querySelector('summary');
        const content = detail.querySelector('.details-content');
        
        if (!summary || !content) return; // Safety check
        
        // Prevent attaching the listener twice if the function is ever called multiple times
        if (detail.dataset.animated) return; 
        detail.dataset.animated = 'true';

        let isAnimating = false;

        summary.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the instant snap
            if (isAnimating) return;
            isAnimating = true;
            
            // Grab all the individual publication items inside this list
            const listItems = content.querySelectorAll('li');

            if (detail.open) {
                // --- CLOSING ANIMATION ---
                content.style.height = content.offsetHeight + 'px';
                content.offsetHeight; // Force browser reflow
                
                content.style.transition = 'height 0.3s ease, opacity 0.3s ease';
                content.style.height = '0px';
                content.style.opacity = '0';
                
                // Instantly hide the text items so they don't look squished as the box shrinks
                listItems.forEach(li => {
                    li.style.transition = 'none';
                    li.style.opacity = '0';
                    li.style.transform = 'translateY(-10px)';
                });
                
                setTimeout(() => {
                    detail.open = false;
                    content.style.transition = '';
                    isAnimating = false;
                }, 300);
                
            } else {
                // --- OPENING ANIMATION ---
                detail.open = true;
                content.style.height = '0px';
                content.style.opacity = '0';
                
                // 1. Reset all items to be invisible and pushed slightly upwards
                listItems.forEach(li => {
                    li.style.transition = 'none';
                    li.style.opacity = '0';
                    li.style.transform = 'translateY(-10px)';
                });

                content.offsetHeight; // Force browser reflow
                
                // 2. Animate the main container opening
                content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';
                
                // 3. Animate each individual paper sliding down and fading in
                listItems.forEach((li, index) => {
                    const delay = index * 0.05; // Stagger effect
                    
                    li.offsetHeight; // Force reflow for the item
                    
                    li.style.transition = `
                        opacity 0.4s ease ${delay}s, 
                        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s
                    `;
                    li.style.opacity = '1';
                    li.style.transform = 'translateY(0)';
                });

                // Calculate exactly when the very last item finishes animating
                const maxDelay = 400 + (listItems.length * 50);
                
                setTimeout(() => {
                    content.style.height = 'auto';
                    content.style.transition = '';
                    isAnimating = false;
                }, Math.max(400, maxDelay));
            }
        });
    });
}
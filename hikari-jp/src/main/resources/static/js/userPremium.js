// Accordion functionality
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', function () {
        const content = this.parentElement.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all accordions
        accordionButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.parentElement.nextElementSibling.classList.remove('active');
        });

        // Toggle current accordion
        if (!isExpanded) {
            this.setAttribute('aria-expanded', 'true');
            content.classList.add('active');
        }
    });
});

// Initialize first accordion as open
if (accordionButtons.length > 0) {
    accordionButtons[0].setAttribute('aria-expanded', 'true');
    accordionButtons[0].parentElement.nextElementSibling.classList.add('active');
}
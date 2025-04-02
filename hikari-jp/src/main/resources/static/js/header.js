document.addEventListener('DOMContentLoaded', function() {
    // Xử lý dropdown chính
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.pointerEvents = 'auto';
            }
        });

        item.addEventListener('mouseleave', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.pointerEvents = 'none';
            }
        });
    });

    // Xử lý submenu
    const dropdownSubitems = document.querySelectorAll('.dropdown-subitem');

    dropdownSubitems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const submenu = this.querySelector('.dropdown_submenu');
            if (submenu) {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.pointerEvents = 'auto';
            }
        });

        item.addEventListener('mouseleave', function() {
            const submenu = this.querySelector('.dropdown_submenu');
            if (submenu) {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.pointerEvents = 'none';
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Current subscription data
    const currentSubscription = {
        type: "monthly",
        startDate: "01/01/2023",
        endDate: "31/01/2023",
        autoRenew: true,
        remainingDays: 15,
    };

    // Pricing plans data
    const pricingPlans = {
        monthly: {
            name: "Premium Hàng Tháng",
            price: "99.000",
            description: "Thanh toán hàng tháng",
        },
        yearly: {
            name: "Premium Hàng Năm",
            price: "999.000",
            originalPrice: "1.188.000",
            description: "Thanh toán hàng năm (tiết kiệm 16%)",
            discount: "Tiết kiệm 16%",
            popular: true,
        },
        lifetime: {
            name: "Premium Vĩnh Viễn",
            price: "2.999.000",
            description: "Thanh toán một lần, sử dụng mãi mãi",
        },
    };

    // Handle plan selection
    let selectedPlan = currentSubscription.type;
    const planButtons = document.querySelectorAll('.plan-select-btn');
    const upgradeButton = document.getElementById('upgradeButton');

    // Initialize the UI
    updateSelectedPlan(selectedPlan);
    updateUpgradeButton(selectedPlan);

    // Add event listeners to plan buttons
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan');
            selectedPlan = plan;
            updateSelectedPlan(selectedPlan);
            updateUpgradeButton(selectedPlan);
        });
    });

    // Update selected plan UI
    function updateSelectedPlan(plan) {
        planButtons.forEach(button => {
            const buttonPlan = button.getAttribute('data-plan');
            if (buttonPlan === plan) {
                button.classList.remove('btn-outline');
                button.classList.add('btn-primary');

                // Update button text based on current subscription
                if (currentSubscription.type === buttonPlan && buttonPlan !== "lifetime") {
                    button.textContent = "Gia hạn thêm";
                } else {
                    button.textContent = "Chọn gói này";
                }
            } else {
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline');

                // Reset other buttons text
                if (currentSubscription.type === buttonPlan && buttonPlan !== "lifetime") {
                    button.textContent = "Gia hạn thêm";
                } else {
                    button.textContent = "Chọn gói này";
                }
            }
        });
    }

    // Update upgrade button text and state
    function updateUpgradeButton(plan) {
        if (currentSubscription.type === "lifetime" && plan === "lifetime") {
            upgradeButton.disabled = true;
            upgradeButton.textContent = "Bạn đã có gói vĩnh viễn";
        } else {
            upgradeButton.disabled = false;
            upgradeButton.textContent = `Mua thêm ${pricingPlans[plan].name}`;
        }
    }

    // Accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
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
});
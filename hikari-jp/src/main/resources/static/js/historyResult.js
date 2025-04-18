const itemsPerPage = 3;
let currentPage = 1;
let results = [];

document.addEventListener("DOMContentLoaded", () => {
    results = Array.from(document.querySelectorAll(".history"));
    updatePagination();

    document.querySelector(".prev-btn").addEventListener("click", showPrev);
    document.querySelector(".next-btn").addEventListener("click", showNext);
});

function updatePagination() {
    const totalPages = Math.ceil(results.length / itemsPerPage);

    results.forEach((item, index) => {
        const pageIndex = Math.floor(index / itemsPerPage) + 1;
        item.style.display = (pageIndex === currentPage) ? "grid" : "none";
    });

    document.querySelector(".prev-btn").disabled = currentPage === 1;
    document.querySelector(".next-btn").disabled = currentPage === totalPages;
}

function showPrev() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function showNext() {
    const totalPages = Math.ceil(results.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}
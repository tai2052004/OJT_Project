const itemsPerPage = 3;
let currentPage = 1;
let results = [];

document.addEventListener("DOMContentLoaded", () => {
    results = Array.from(document.querySelectorAll(".history"));
    console.log(results.length);
    updatePagination();

});

function updatePagination() {
    const totalPages = Math.ceil(results.length / itemsPerPage);

    // Ẩn tất cả các phần tử
    results.forEach(item => {
        item.style.display = 'none';
        console.log(item.id);
    });
    console.log("Cac phan tu tiep theo la")
    // Hiển thị chỉ các phần tử thuộc trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < results.length; i++) {
        results[i].style.display = 'grid';
        console.log(results[i].id);
    }

    // Cập nhật trạng thái nút điều hướng
    document.querySelector('.prev-btn').disabled = currentPage <= 1;
    document.querySelector('.next-btn').disabled = currentPage >= totalPages;
}

function showPrev(e) {
    e?.stopPropagation();
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function showNext(e) {
    e?.stopPropagation();
    const totalPages = Math.ceil(results.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

document.getElementById('back-btn').addEventListener('click', function() {
    const resultDetail = document.querySelector('.result-detail');
    const overlay = document.querySelector('.overlay');
    resultDetail.classList.remove('active');
    resultDetail.classList.add('hidden');
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
});


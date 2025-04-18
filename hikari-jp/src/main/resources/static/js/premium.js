document.querySelectorAll("form[name='buyForm']").forEach(function (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!isLoggedIn) {
            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập!",
                text: "Vui lòng đăng nhập để mua gói.",
                confirmButtonText: "OK"
            });
            return;
        }

        if (hasPremium) {
            Swal.fire({
                title: "Xác nhận",
                text: "Bạn có muốn chuyển sang gói mới không? Gói hiện tại sẽ bị hủy.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        } else {
            form.submit();
        }
    });
});
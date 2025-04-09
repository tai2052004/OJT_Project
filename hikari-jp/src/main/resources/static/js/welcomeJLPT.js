// Hàm bật chế độ toàn màn hình
function enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari và Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}


// Xử lý khi thoát fullscreen (nếu cần)
document.addEventListener('fullscreenchange', () => {
    const warningOverlay = document.getElementById('warningOverlay');
    const warningBox = document.getElementById('warningBox');

    if (!document.fullscreenElement) {
        warningOverlay.style.display = "flex";
        setTimeout(() => {
            warningBox.classList.add('show');
        }, 10);
    } else {
        warningBox.classList.remove('show');
        setTimeout(() => {
            warningOverlay.style.display = "none";
        }, 300);
    }
});
document.getElementById('continueBtn').addEventListener('click', () => {
    enterFullscreen();
});
const understandBtn = document.getElementById('understand-btn');
const backBtn = document.getElementById('back-btn');
const returnbtn = document.getElementById('return-btn');
const screen1 = document.querySelector('.screen-1');
const screen2 = document.querySelector('.screen-2');
const screen3 = document.querySelector('.screen-3');
const back = document.getElementById('back');
const next = document.getElementById('next');

// Hiệu ứng khi bấm "I understand"
understandBtn.addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        enterFullscreen();
    }
    screen1.classList.add('hide');
    screen2.classList.add('show');
    returnbtn.classList.add('hide');
});

// Hiệu ứng khi bấm "Back"
backBtn.addEventListener('click', () => {
    screen1.classList.remove('hide');
    screen2.classList.remove('show');
    returnbtn.classList.remove('hide');
});

back.addEventListener('click', () => {
    screen2.classList.remove('hide');
    screen2.classList.add('show');
    screen3.classList.remove('show');
});

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");
const resultEl = document.getElementById("result");

let startTime = null;
let scanning = true;

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Không thể truy cập camera:", err));

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl)
]).then(() => {
    console.log("✅ Mô hình SSD Mobilenet V1 đã được tải.");
});

function autoStartScan() {
    messageEl.innerText = "👉 Vui lòng đưa mặt bạn vào khung hình";
    startTime = performance.now();
    scanning = true;
    scanLoop();
}

let lastDetectionTime = 0;
const detectionInterval = 1500; // 2 giây

async function scanLoop(timestamp) {
    if (!scanning) return;

    const elapsedSeconds = (timestamp - startTime) / 1000;
    // Vẽ video vào canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Kiểm tra nếu đã đủ thời gian từ lần quét trước
    if (timestamp - lastDetectionTime >= detectionInterval) {
        lastDetectionTime = timestamp; // cập nhật mốc thời gian

        const detections = await faceapi.detectAllFaces(canvas);

        // Clear khung trước khi vẽ
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (detections.length > 1) {
            messageEl.innerText = "⚠️ Có nhiều hơn 1 khuôn mặt. Vui lòng chỉ có 1 người.";

            scanning = false; // DỪNG QUÉT LUÔN
            resultEl.innerText = "⚠️ Nhiều hơn 1 khuôn mặt. Không thể xác minh.";
            document.getElementById("ok").style.display = "inline-block";
            document.getElementById("next").style.display = "none";
            document.querySelector(".result-overlay").style.display = "block";
            return;
        } else if (detections.length === 1) {
            const box = detections[0].box;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            messageEl.innerText = "✅ Khuôn mặt hợp lệ, đang lưu ảnh...";
            scanning = false;
            captureAndSend();
            document.getElementById("next").style.display = "inline-block";
            document.getElementById("ok").style.display = "none";
            const resultDiv = document.querySelector(".result-overlay");
            resultDiv.style.display = "block";
            return;
        } else {
            messageEl.innerText = "🕵️ Đang tìm khuôn mặt...";
        }
    }

    if (elapsedSeconds >= 15) {
        messageEl.innerText = "⏰ Hết thời gian. Không phát hiện đúng 1 khuôn mặt.";
        document.getElementById("ok").style.display = "inline-block";
        document.getElementById("next").style.display = "none";
        resultEl.innerText = "Time out! Can't verify your face, try again."
        const resultDiv = document.querySelector(".result-overlay");
        resultDiv.style.display = "block";
        scanning = false;
        return;
    }

    requestAnimationFrame(scanLoop);
}
next.addEventListener('click', () => {
    screen2.classList.remove('show');
    screen2.classList.add('hide');
    screen3.classList.add('show');
});

document.getElementById('ok').addEventListener('click', () => {
    document.querySelector(".result-overlay").style.display = "none";
    messageEl.innerText = "👉 Vui lòng đưa mặt bạn vào khung hình";
    scanning = true;
});

async function captureAndSend() {
    // Đã vẽ video lên canvas rồi, không cần detect lại
    canvas.style.display = "block";

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("file", blob, "face.jpg");

        fetch("/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.text())
            .then(msg => {
                resultEl.innerText = msg;
                messageEl.innerText = "📸 Ảnh đã được lưu.";
            })
            .catch(err => {
                messageEl.innerText = "❌ Lỗi khi gửi ảnh.";
                console.error(err);
            });
    }, "image/jpeg");
}


function validateFace() {
    fetch("/api/face/validate")
        .then(res => res.text())
        .then(data => resultEl.innerText = data)
        .catch(err => console.error("Lỗi xác thực:", err));
}
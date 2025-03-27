async function convertTextToSpeech() {
    const text = document.getElementById("textToSpeak").value.trim();
    const audio = document.getElementById("audioPlayer");

    if (!text) {
        audio.src = "";
        audio.disabled = true; // Tắt audio nếu chưa nhập
        return;
    }

    const apiKey = "AIzaSyBoDBmFoXR8QcqFiGIp7oZ3QniEzoA-OrY"; // Thay bằng API Key của bạn

    const request = {
        input: { text: text },
        voice: { languageCode: "ja-JP", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (data.audioContent) {
            audio.src = `data:audio/mp3;base64,${data.audioContent}`;
            audio.disabled = false; // Bật nút Play khi có âm thanh
        } else {
            console.error("Lỗi phản hồi từ API:", data);
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}
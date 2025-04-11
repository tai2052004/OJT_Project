package com.controller;

import com.service.FaceDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
public class FaceDetectionController {

    // Nhận file từ client và lưu vào thư mục "uploaded_faces"
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFace(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa tồn tại
            Path uploadDir = Paths.get("D:/uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Đặt tên file duy nhất
            String fileName = "face_" + System.currentTimeMillis() + ".jpg";
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("Verify successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi lưu ảnh");
        }
    }

    @PostMapping("/api/face/validate")
    public ResponseEntity<String> validateFace(@RequestParam("file") MultipartFile file) {
        try {
            String result = FaceDetectionService.validateLastUploadedFace(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi xác thực khuôn mặt");
        }
    }

}

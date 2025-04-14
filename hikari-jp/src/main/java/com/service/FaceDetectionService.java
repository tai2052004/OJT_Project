package com.service;

import jakarta.annotation.PostConstruct;
import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Comparator;

@Service
public class FaceDetectionService {
    private static final String CASCADE_FILE = "haarcascade_frontalface_alt.xml";
    private static CascadeClassifier classifier;

    @PostConstruct
    public void init() {
        try {
            // Load haarcascade từ resources
            InputStream is = new ClassPathResource(CASCADE_FILE).getInputStream();
            File tempFile = File.createTempFile("cascade", ".xml");
            Files.copy(is, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            classifier = new CascadeClassifier(tempFile.getAbsolutePath());

            if (classifier.empty()) {
                throw new IllegalStateException("Không thể load cascade classifier.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String validateLastUploadedFace(MultipartFile file) throws Exception {
        // Đọc ảnh từ MultipartFile (ảnh camera gửi lên)
        File tempCaptured = File.createTempFile("captured", ".jpg");
        file.transferTo(tempCaptured);

        Mat capturedImg = opencv_imgcodecs.imread(tempCaptured.getAbsolutePath());
        if (capturedImg.empty()) {
            return "Face not valid";
        }

        Mat capturedGray = new Mat();
        opencv_imgproc.cvtColor(capturedImg, capturedGray, opencv_imgproc.COLOR_BGR2GRAY);
        RectVector capturedFaces = new RectVector();
        classifier.detectMultiScale(capturedGray, capturedFaces);

        // Đọc ảnh gốc đã lưu
        File folder = new File("D:/uploads");
        File[] files = folder.listFiles((dir, name) -> name.endsWith(".jpg"));

        if (files == null || files.length == 0) {
            return "Face not valid";
        }

        Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
        File latestFile = files[0];
        if (!latestFile.exists()) {
            return "Face not valid";
        }


        Mat storedGray = new Mat();
        opencv_imgproc.cvtColor(capturedImg, storedGray, opencv_imgproc.COLOR_BGR2GRAY);
        RectVector storedFaces = new RectVector();
        classifier.detectMultiScale(storedGray, storedFaces);

        if (storedFaces.size() == 0) {
            return "Face not valid"; // không có mặt trong ảnh lưu
        }
        if (capturedFaces.size() == 0) {
            System.out.println("❌ Không tìm thấy khuôn mặt trong ảnh chụp.");
            return "Face not valid";
        }
        // So sánh khuôn mặt (đơn giản bằng cách crop và dùng norm để so sánh)
        Rect capturedFaceRect = capturedFaces.get(0);
        Rect storedFaceRect = storedFaces.get(0);

        Mat face1 = new Mat(capturedGray, capturedFaceRect);
        Mat face2 = new Mat(storedGray, storedFaceRect);

        // Resize ảnh về cùng kích thước để so sánh
        Mat resizedFace1 = new Mat();
        Mat resizedFace2 = new Mat();
        Size standardSize = new Size(100, 100);
        opencv_imgproc.resize(face1, resizedFace1, standardSize);
        opencv_imgproc.resize(face2, resizedFace2, standardSize);

        // So sánh độ tương đồng bằng norm (khoảng cách Euclidean)
        double similarity = opencv_core.norm(resizedFace1, resizedFace2);

        System.out.println("Similarity = " + similarity);
        System.out.println("📸 Số khuôn mặt tìm được từ ảnh chụp: " + capturedFaces.size());
        System.out.println("📁 Số khuôn mặt trong ảnh lưu: " + storedFaces.size());
        if (similarity < 1000) { // ngưỡng so sánh, có thể điều chỉnh
            return "Face valid";
        } else {
            return "Face not valid";
        }
    }
}

package com.hikari.hikari_jp.service;

import jakarta.annotation.PostConstruct;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

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

    public static String validateLastUploadedFace() throws Exception {
        File folder = new File("D:/uploads");  // đường dẫn mới
        File[] files = folder.listFiles((dir, name) -> name.endsWith(".jpg"));

        if (files == null || files.length == 0) {
            return "Không tìm thấy ảnh đã upload.";
        }

        Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
        File latestFile = files[0];

        if (!latestFile.exists()) {
            return "File không tồn tại!";
        }

        Mat image = opencv_imgcodecs.imread(latestFile.getAbsolutePath());
        if (image.empty()) {
            return "Không đọc được ảnh.";
        }

        Mat gray = new Mat();
        opencv_imgproc.cvtColor(image, gray, opencv_imgproc.COLOR_BGR2GRAY);

        RectVector faces = new RectVector();
        classifier.detectMultiScale(gray, faces);  // lúc này classifier đã có

        if (faces.size() == 0) {
            return "Không phát hiện khuôn mặt.";
        } else {
            return "Đã phát hiện " + faces.size() + " khuôn mặt.";
        }
    }
}

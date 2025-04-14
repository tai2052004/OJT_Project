package com.config;

import jakarta.annotation.PostConstruct;
import org.bytedeco.javacpp.Loader;
import org.bytedeco.opencv.opencv_java;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        // Xử lý ảnh trong thư mục upload
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:upload/");

        registry
                .addResourceHandler("/models/**")
                .addResourceLocations("classpath:/static/models/");
    }

    @PostConstruct
    public void loadOpenCVNativeLibrary() {
        Loader.load(opencv_java.class); // Tự động load native library
        System.out.println("OpenCV native library loaded!");
    }

}
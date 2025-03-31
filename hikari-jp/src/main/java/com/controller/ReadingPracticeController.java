package com.controller;

import org.springframework.ui.Model;
import com.model.ReadingPractice;
import com.service.ReadingPracticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ReadingPracticeController {
    @Autowired
    ReadingPracticeService readingPracticeService;

    @GetMapping("/getReadingPractice")
    public String getReadingPractice(@RequestParam("level_id") int levelID, @RequestParam("topic_num") int topicNUM, Model model) {
        ReadingPractice rp = readingPracticeService.getReadingPracticeByTopicNUMAndLevel(levelID,topicNUM);
        if (rp != null) {

            // Debug: Kiểm tra số câu hỏi lấy được
            System.out.println("Reading ID: " + rp.getReading_id());
            System.out.println("Passage: " + rp.getPassage());
            System.out.println("Số câu hỏi: " + rp.getPracticeDetails().size());
        } else {
            throw new RuntimeException("Không tìm thấy bài đọc!");
        }
        model.addAttribute("readingPractices", rp);

        return "Practice";
    }
}

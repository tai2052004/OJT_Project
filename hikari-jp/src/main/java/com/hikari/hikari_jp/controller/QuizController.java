package com.hikari.hikari_jp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class QuizController {
    @GetMapping("/quizzInterface")
    public String quizInterface(@RequestParam String level, Model model) {
        model.addAttribute("level", level);
        return "quizzInterface";
    }
}

package com.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String home() {
        return "landingPage";
    }

    @GetMapping("/Practice")
    public String practice() { return "Practice"; }

    @GetMapping("/lookUp")
    public String lookUp() { return "lookUp"; }

    @PostMapping("/clearModel")
    public String clearModelVariable(Model model, HttpSession session) {
        model.addAttribute("readingPractices", null);
        session.removeAttribute("readingPractices");
        return "Practice"; // Trả về trang hiện tại
    }
    @PostMapping("/clearListening")
    public String clearListening(Model model, HttpSession session) {
        model.addAttribute("listeningPractices", null);
        session.removeAttribute("listeningPractices");
        return "Practice";
    }
    @GetMapping("/jlptTest")
    public String jlptTest() { return "welcomeJLPT"; }



    @GetMapping("/backToHome")
    public String backToHome() { return "landingPage"; }

    @GetMapping("/flashcards")
    public String flashcards() { return "flashcards"; }

    @GetMapping("/premium")
    public String premium() { return "premium"; }

    @GetMapping("/test")
    public String test() {
        return "testJLPT";
    }
}
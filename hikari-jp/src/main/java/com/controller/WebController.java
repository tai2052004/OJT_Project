package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String home() {
        return "landingPage";
    }

    @GetMapping("/Practice")
    public String practice() { return "Practice"; }

    @GetMapping("/LookUp")
    public String lookUp() { return "lookUp"; }

    @GetMapping("/clearModel")
    public String clearModelVariable(Model model) {
        model.addAttribute("readingPractices", null);
        return "Practice"; // Trả về trang hiện tại
    }

    @GetMapping("/jlptTest")
    public String jlptTest() { return "testJLPT"; }

    @GetMapping("/backToHome")
    public String backToHome() { return "landingPage"; }
}